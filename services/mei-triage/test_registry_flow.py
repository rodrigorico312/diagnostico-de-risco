import unittest,json
from unittest.mock import patch
from domain import questions,plan,registry_indicator
from worker import lookup

class RegistryFlow(unittest.TestCase):
 def test_manual_check_is_required_regardless_of_auxiliary_flag(self):
  for flag in (True,False,None):
   src={'cadastro':{'simei':flag}}
   self.assertEqual(questions(src)[:3],['identity','simei_check','debt'])
   self.assertNotIn('payments',questions(src))
   self.assertFalse(plan({'identity':'yes','debt':'no'},src)['complete'])
  self.assertEqual(questions({})[:2],['simei_check','debt'])
 def test_payment_branch_uses_the_user_check_and_not_auxiliary_flag(self):
  self.assertIn('payments',questions({'cadastro':{'simei':False}},{'simei_check':'yes'}))
  for answer in ('no','unknown'):
   self.assertNotIn('payments',questions({'cadastro':{'simei':True}},{'simei_check':answer}))
  self.assertNotIn('payments',questions({}, {'simei_check':'yes','debt':'no'}))
 def test_legacy_declaration_is_not_reused(self):
  for old in ('yes','no','never','unknown'):
   self.assertEqual(plan({'simei':old},{}),plan({},{}))
   self.assertNotIn('payments',questions({}, {'simei':old}))
 def test_confirmed_mei_does_not_repeat_a_confirmation_task(self):
  result=plan({'identity':'yes','simei_check':'yes','debt':'no'},{'cadastro':{'simei':False}})
  self.assertTrue(result['complete'])
  self.assertEqual(result['steps'][0]['id'],'monthly')
  self.assertNotIn('Você informou',json.dumps(result,ensure_ascii=False))
 def test_auxiliary_indicator_keeps_strict_boolean(self):
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
