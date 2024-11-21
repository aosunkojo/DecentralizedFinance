import { describe, it, expect } from 'vitest'
import { readFileSync } from 'fs'

const contractSource = readFileSync('./contracts/stablecoin.clar', 'utf8')

describe('Stablecoin Contract', () => {
  it('should define contract-owner constant', () => {
    expect(contractSource).toContain('(define-constant contract-owner tx-sender)')
  })
  
  it('should define error constant', () => {
    expect(contractSource).toContain('(define-constant err-not-authorized (err u100))')
  })
  
  it('should define fungible token', () => {
    expect(contractSource).toContain('(define-fungible-token stablecoin)')
  })
  
  it('should have a mint function', () => {
    expect(contractSource).toContain('(define-public (mint (amount uint) (recipient principal))')
  })
  
  it('should check authorization in mint function', () => {
    expect(contractSource).toContain('(asserts! (is-eq tx-sender contract-owner) err-not-authorized)')
  })
  
  it('should have a transfer function', () => {
    expect(contractSource).toContain('(define-public (transfer (amount uint) (sender principal) (recipient principal))')
  })
  
  it('should check authorization in transfer function', () => {
    expect(contractSource).toContain('(asserts! (is-eq tx-sender sender) err-not-authorized)')
  })
  
  it('should have a get-balance read-only function', () => {
    expect(contractSource).toContain('(define-read-only (get-balance (account principal))')
  })
  
  it('should have a get-total-supply read-only function', () => {
    expect(contractSource).toContain('(define-read-only (get-total-supply)')
  })
  
  it('should use ft-mint? for minting', () => {
    expect(contractSource).toContain('(ft-mint? stablecoin amount recipient)')
  })
  
  it('should use ft-transfer? for transfers', () => {
    expect(contractSource).toContain('(ft-transfer? stablecoin amount sender recipient)')
  })
  
  it('should use ft-get-balance for balance queries', () => {
    expect(contractSource).toContain('(ft-get-balance stablecoin account)')
  })
  
  it('should use ft-get-supply for total supply queries', () => {
    expect(contractSource).toContain('(ft-get-supply stablecoin)')
  })
})
