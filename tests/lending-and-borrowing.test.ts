;; tests/lending-and-borrowing_test.ts

import { Clarinet, Tx, Chain, Account, types } from 'https://deno.land/x/clarinet@v0.14.0/index.ts';
import { assertEquals } from 'https://deno.land/std@0.90.0/testing/asserts.ts';

Clarinet.test({
  name: "Ensure that users can deposit, withdraw, borrow, and repay",
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const deployer = accounts.get('deployer')!;
    const wallet1 = accounts.get('wallet_1')!;
    
    let block = chain.mineBlock([
      Tx.contractCall('lending-and-borrowing', 'deposit', [types.uint(1000000)], wallet1.address),
    ]);
    assertEquals(block.receipts[0].result, '(ok u1000000)');
    
    block = chain.mineBlock([
      Tx.contractCall('lending-and-borrowing', 'add-collateral', [types.uint(2000000)], wallet1.address),
    ]);
    assertEquals(block.receipts[0].result, '(ok u2000000)');
    
    block = chain.mineBlock([
      Tx.contractCall('lending-and-borrowing', 'borrow', [types.uint(500000)], wallet1.address),
    ]);
    assertEquals(block.receipts[0].result, '(ok u500000)');
    
    block = chain.mineBlock([
      Tx.contractCall('lending-and-borrowing', 'repay', [types.uint(500000)], wallet1.address),
    ]);
    assertEquals(block.receipts[0].result, '(ok u500000)');
    
    block = chain.mineBlock([
      Tx.contractCall('lending-and-borrowing', 'withdraw', [types.uint(1000000)], wallet1.address),
    ]);
    assertEquals(block.receipts[0].result, '(ok u1000000)');
  },
});
