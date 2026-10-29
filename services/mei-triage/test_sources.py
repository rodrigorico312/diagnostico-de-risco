import unittest,json
from unittest.mock import patch
from worker import lookup
class SourceCoverage(unittest.TestCase):
 def test_wrong_cnpj_not_saved(self):
  class Result:
   def __enter__(self):return self
   def __exit__(self,*a):pass
   def read(self,*a):return json.dumps({'cnpj':'00000000000191','razao_social':'Fixture'}).encode()
  with patch('worker.urllib.request.urlopen',return_value=Result()):
   r=lookup('62560654000127');self.assertIsNone(r['cadastro']);self.assertEqual(r['cadastro_status'],'unavailable')
 def test_source_error_is_not_zero_debt(self):
  with patch('worker.urllib.request.urlopen',side_effect=TimeoutError()):
   r=lookup('62560654000127');self.assertIsNone(r['cadastro']);self.assertNotIn('debt_amount',r);self.assertEqual(r['official']['status'],'human_required')
if __name__=='__main__':unittest.main()
