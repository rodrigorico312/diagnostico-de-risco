import {test} from 'node:test';
import assert from 'node:assert/strict';
import {recordYears,medievalYear} from '../src/history/timeNavigation';
import {readHistoryView} from '../src/history/data';

test('sequência temporal usa apenas os anos documentados, sem inventar intervalos',()=>{
 assert.deepEqual(recordYears([{year:2002},{year:0},{year:1988},{year:2002},{year:NaN}]),[0,1988,2002]);
 assert.deepEqual(recordYears([]),[]);
});
test('marco medieval compartilhado aceita somente anos finitos entre 500 e 1500',()=>{
 assert.equal(medievalYear(null),1000);assert.equal(medievalYear(''),1000);
 assert.equal(medievalYear('Infinity'),1000);assert.equal(medievalYear({}),1000);
 assert.equal(medievalYear('1200'),1200);assert.equal(medievalYear(1499.8),1500);
 assert.equal(medievalYear('2026'),1500);assert.equal(medievalYear(-100),500);
});
test('link da exploração histórica restaura a aba integrada',()=>{
 assert.equal(readHistoryView(new URLSearchParams('h_tela=explorer&m_ano=1200')).tab,'explorer');
 assert.equal(readHistoryView(new URLSearchParams('h_tela=not-a-tab')).tab,'timeline');
});
