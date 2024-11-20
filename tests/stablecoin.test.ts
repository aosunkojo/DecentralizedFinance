;; tests/stablecoin_test.ts

import { Clarinet, Tx, Chain, Account, types } from 'https://deno.land/x/clarinet@v0.14.0/index.ts';
import { assertEquals } from 'https://deno.land/std@0.90.0/testing/asserts.ts';

Clarinet.test({
  name: "Ensure that contract owner can mint, users can transfer, and burn stablecoins",
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const deployer = accounts.get('deployer')!;
    const wallet1 = accounts.get('wallet_1')!;
    
    let block = chain.mineBlock([
      Tx.contractCall('stablecoin', 'mint', [types.uint(1000000), types.principal(wallet1.address)], deployer.address),
    ]);
    assertEquals(block.receipts[0].result, '(ok true)');
    
    block = chain.mineBlock([
      Tx.contractCall('stablecoin', 'transfer', [types.uint(500000), types.principal(wallet1.address), types.principal(deployer.address)], wallet1.address),
    ]);
    assertEquals(block.receipts[0].result, '(ok true)');
    
    block = chain.mineBlock([
      Tx.contractCall('stablecoin', 'burn', [types.uint(500000), types.principal(wallet1.address)], wallet1.address),
    ]);
    assertEquals(block.receipts[0].result, '(ok true)');
  },
});
