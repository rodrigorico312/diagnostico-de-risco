"""Decodificador BER presidencial. Valida campos esperados e concilia todos os votos.
Não valida assinaturas criptográficas e não identifica eleitor ou horário de voto.
"""
def ber(data):
    nodes = []
    i = 0
    while i < len(data):
        tag = data[i]; i += 1
        if tag & 31 == 31:
            raise ValueError('Tag longa nao implementada')
        size = data[i]; i += 1
        if size & 128:
            n = size & 127
            if not n:
                raise ValueError('Comprimento indefinido nao implementado')
            size = int.from_bytes(data[i:i+n], 'big'); i += n
        raw = data[i:i+size]; i += size
        if len(raw) != size:
            raise ValueError('BER truncado')
        nodes.append((tag, ber(raw) if tag & 32 else raw))
    return nodes

def integer(node):
    return int.from_bytes(node[1], 'big', signed=True)

def decode_bu(data, election_id=6258):
    envelope = ber(data)[0][1]
    assert envelope[4][0] == 4
    body = ber(envelope[4][1])[0][1]
    assert body[3][0] == 48 and body[6][0] == 2 and body[8][0] == 48
    idsec = body[3][1]
    municipio = integer(idsec[0][1][0])
    zona = integer(idsec[0][1][1])
    secao = integer(idsec[2])
    comparecimento = integer(body[6])
    spans = body[5]
    assert spans[0] == 160
    inicio, fim = [n[1].decode('ascii') for n in spans[1]]
    elections = []
    for ele in body[8][1]:
        e = ele[1]
        assert e[0][0] == 2
        if integer(e[0]) != election_id:
            continue
        result = dict(eleicao=integer(e[0]), aptos=integer(e[1]), votos={})
        # No leiaute observado de 2026, resultadosPorTipoVoto e a primeira
        # SEQUENCE depois dos contadores da eleicao.
        types = next(n[1] for n in e[1:] if n[0] == 48)
        for typ in types:
            t = typ[1]
            assert t[2][0] == 48
            for cargo in t[2][1]:
                c = cargo[1]
                assert c[0][0] == 129 and integer(c[0]) == 1, 'Cargo inesperado em BU presidencial'
                for vote in c[2][1]:
                    v = vote[1]
                    assert v[0][0] == 129 and v[1][0] == 130
                    kind, count = integer(v[0]), integer(v[1])
                    if kind == 1:
                        cand = integer(v[2][1][0])
                        label = str(cand)
                    else:
                        label = {2: 'branco', 3: 'nulo'}.get(kind, f'tipo_{kind}')
                    result['votos'][label] = result['votos'].get(label, 0) + count
        assert sum(result['votos'].values()) == comparecimento, 'BU nao reconciliado'
        elections.append(result)
    pres = [e for e in elections if e['eleicao'] == election_id]
    assert len(pres) == 1
    return dict(municipio_bu=municipio, zona_bu=zona, secao_bu=secao,
                comparecimento_bu=comparecimento, inicio_local=inicio,
                fim_local=fim, **pres[0])
