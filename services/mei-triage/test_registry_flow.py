import unittest,json
from unittest.mock import patch
from domain import questions,plan,registry_indicator
from worker import lookup
class RegistryFlow(unittest.TestCase):
 def test_enquadramento_is_not_a_user_question(self):
  for flag in (True,False,None):
   src={'cadastro':{'simei':flag}}
   self.assertNotIn('simei',questions(src))
   self.assertEqual(questions(src,{'simei':'never'}),questions(src))
   self.assertEqual(plan({'simei':'never'},src),plan({},src))
 def test_auxiliary_true_can_only_guide_preliminary_questions(self):
  self.assertIn('payments',questions({'cadastro':{'simei':True}}))
  self.assertNotIn('payments',questions({'cadastro':{'simei':None}},{'simei':'yes'}))
  self.assertIsNone(registry_indicator({'cadastro':{'simei':'true'}}))
  self.assertIsNone(registry_indicator({}))
 def test_normalization_keeps_only_requested_business_address(self):
  fixture={'cnpj':'62560654000127','razao_social':'EMPRESA FICTICIA DE TESTE','data_inicio_atividade':'2025-09-04','opcao_pelo_mei':True,'logradouro':' RUA DE TESTE ','numero':'12','bairro':'CENTRO','municipio':'CIDADE DE TESTE','uf':'PA','cep':'00000000','qsa':[{'cpf':'fixture-private'}],'ddd_telefone_1':'fixture-phone'}
  class Result:
   def __enter__(self):return self
   def __exit__(self,*args):pass
   def read(self,*args):return json.dumps(fixture).encode()
  with patch('worker.urllib.request.urlopen',return_value=Result()):
   result=lookup('62560654000127')
  self.assertEqual(result['schema_version'],2)
  self.assertEqual(result['cadastro']['address']['street'],'RUA DE TESTE')
  self.assertEqual(result['cadastro']['opened_at'],'2025-09-04')
  self.assertTrue(result['cadastro']['simei'])
  self.assertEqual(result['official']['status'],'human_required')
  self.assertNotIn('fixture-private',json.dumps(result))
  self.assertNotIn('fixture-phone',json.dumps(result))
if __name__=='__main__':unittest.main()
