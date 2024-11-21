import { describe, it, expect } from 'vitest'
import { readFileSync } from 'fs'

const contractSource = readFileSync('./contracts/lending-and-borrowing.clar', 'utf8')

describe('Lending and Borrowing Contract', () => {
  it('should define error constants', () => {
    expect(contractSource).toContain('(define-constant err-insufficient-balance (err u101))')
    expect(contractSource).toContain('(define-constant err-insufficient-collateral (err u102))')
  })
  
  it('should define lending-pool variable', () => {
    expect(contractSource).toContain('(define-data-var lending-pool uint u0)')
  })
  
  it('should define user maps', () => {
    expect(contractSource).toContain('(define-map user-deposits principal uint)')
    expect(contractSource).toContain('(define-map user-borrows principal uint)')
    expect(contractSource).toContain('(define-map user-collateral principal uint)')
  })
  
  it('should have a deposit function', () => {
    expect(contractSource).toContain('(define-public (deposit (amount uint))')
  })
  
  it('should have a withdraw function', () => {
    expect(contractSource).toContain('(define-public (withdraw (amount uint))')
  })
  
  it('should have a borrow function', () => {
    expect(contractSource).toContain('(define-public (borrow (amount uint))')
  })
  
  it('should check for insufficient balance in withdraw function', () => {
    expect(contractSource).toContain('(asserts! (<= amount current-balance) err-insufficient-balance)')
  })
  
  it('should check for insufficient collateral in borrow function', () => {
    expect(contractSource).toContain('(asserts! (>= (* collateral u2) (+ current-borrows amount)) err-insufficient-collateral)')
  })
  
  it('should have read-only functions for user data', () => {
    expect(contractSource).toContain('(define-read-only (get-user-deposits (user principal))')
    expect(contractSource).toContain('(define-read-only (get-user-borrows (user principal))')
    expect(contractSource).toContain('(define-read-only (get-user-collateral (user principal))')
  })
  
  it('should have a read-only function for lending pool balance', () => {
    expect(contractSource).toContain('(define-read-only (get-lending-pool-balance)')
  })
})

