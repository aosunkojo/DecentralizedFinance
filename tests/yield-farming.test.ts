;; tests/yield-farming_test.ts

import { Clarinet, Tx, Chain, Account, types } from 'https://deno.land/x/clarinet@v0.14.0/index.ts';
import { assertEquals } from 'https://deno.land/std@0.90.0/testing/asserts.ts';

Clarinet.test({
  name: "Ensure that users can stake, unstake, and claim rewards",
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const deployer = accounts.get('deployer')!;
    const wallet1 = accounts.get('wallet_1')!;
    
    let block = chain.mineBlock([
      Tx.contractCall('yield-farming', 'stake', [types.uint(1000000)], wallet1.address),
    ]);
    assertEquals(block.receipts[0].result, '(ok u1000000)');
    
    chain.mineEmptyBlockUntil(20);
    
    block = chain.mineBlock([
      Tx.contractCall('yield-farming', 'claim-rewards', [], wallet1.address),
    ]);
    assertEquals(block.receipts[0].result.startsWith('(ok u'), true);
    
    block = chain.mineBlock([
      Tx.contractCall('yield-farming', 'unstake', [types.uint(1000000)], wallet1.address),
    ]);
    assertEquals(block.receipts[0].result, '(ok u1000000)');
  },
});
