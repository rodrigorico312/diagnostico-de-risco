import unittest,json
from domain import questions,plan
from guidance import question_guidance,answer_feedback
class PracticalGuidance(unittest.TestCase):
 def test_debt_dates_and_agreement_channel_are_conditional(self):
  q=questions({}, {'debt':'yes','installment':'yes'})
  self.assertIn('debt_period',q);self.assertIn('installment_channel',q)
  self.assertNotIn('debt_period',questions({}, {'debt':'unknown'}))
  self.assertNotIn('installment_channel',questions({}, {'debt':'no'}))
 def test_confirmed_mei_is_not_a_redundant_final_task(self):
  result=plan({'simei_check':'yes','debt':'no'}, {})
  self.assertEqual([c['id'] for c in result['steps']],['monthly'])
  text=json.dumps(result,ensure_ascii=False)
  self.assertNotIn('Você informou',text);self.assertNotIn('Este quiz',text)
 def test_calendar_and_original_due_date_are_explicit(self):
  result=plan({'simei_check':'yes','debt':'yes','debt_period':'both'}, {})
  text=json.dumps(result,ensure_ascii=False)
  for needed in ['Janeiro/2027','Julho/2027','13/10/2026','vencimento original','20/10/2026']:
   self.assertIn(needed,text)
  self.assertNotIn('20/11/2026',text)
 def test_every_task_teaches_actions_and_has_no_old_guide_links(self):
  for mei in ('yes','no','unknown'):
   for debt in ('yes','no','unknown'):
    result=plan({'simei_check':mei,'debt':debt,'installment':'unknown','lawsuit':'unknown'}, {})
    ids=[c['id'] for c in result['steps']]
    self.assertEqual(len(ids),len(set(ids)))
    for c in result['steps']:self.assertGreaterEqual(len(c['instructions']),3)
    self.assertNotIn('material=1',json.dumps(result))
    self.assertNotIn('Abrir orientação',json.dumps(result,ensure_ascii=False))
 def test_agreement_channel_changes_the_actions(self):
  for channel,host in [('rfb','servicos.receitafederal.gov.br'),('pgfn','regularize.pgfn.gov.br')]:
   result=plan({'simei_check':'yes','debt':'yes','installment':'yes','installment_channel':channel}, {})
   agreement=next(c for c in result['steps'] if c['id']=='agreements')
   self.assertIn(host,agreement['instructions'][0]['link']['url'])
   self.assertIn('independentemente de requerimento',json.dumps(agreement,ensure_ascii=False))
 def test_content_during_questions_and_after_answers(self):
  self.assertTrue(question_guidance()['debt']['cards'][0]['instructions'])
  self.assertIsNotNone(answer_feedback('payments','no',{}))
  self.assertIsNone(answer_feedback('identity','yes',{}))
if __name__=='__main__':unittest.main()
