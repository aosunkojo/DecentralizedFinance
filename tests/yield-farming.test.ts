import { describe, it, expect } from 'vitest'
import { readFileSync } from 'fs'

const contractSource = readFileSync('./contracts/yield-farming.clar', 'utf8')

describe('Yield Farming Contract', () => {
  it('should define error constant', () => {
    expect(contractSource).toContain('(define-constant err-insufficient-balance (err u101))')
  })
  
  it('should define total-staked data variable', () => {
    expect(contractSource).toContain('(define-data-var total-staked uint u0)')
  })
  
  it('should define reward-rate data variable', () => {
    expect(contractSource).toContain('(define-data-var reward-rate uint u100)')
  })
  
  it('should define user-stakes map', () => {
    expect(contractSource).toContain('(define-map user-stakes { user: principal } { amount: uint, last-update: uint })')
  })
  
  it('should have a stake function', () => {
    expect(contractSource).toContain('(define-public (stake (amount uint))')
  })
  
  it('should update user stake in stake function', () => {
    expect(contractSource).toContain('(map-set user-stakes { user: tx-sender } { amount: new-stake, last-update: block-height })')
  })
  
  it('should have an unstake function', () => {
    expect(contractSource).toContain('(define-public (unstake (amount uint))')
  })
  
  it('should check for insufficient balance in unstake function', () => {
    expect(contractSource).toContain('(asserts! (<= amount (get amount current-stake)) err-insufficient-balance)')
  })
  
  it('should have a get-user-stake read-only function', () => {
    expect(contractSource).toContain('(define-read-only (get-user-stake (user principal))')
  })
  
  it('should have a get-total-staked read-only function', () => {
    expect(contractSource).toContain('(define-read-only (get-total-staked)')
  })
  
  it('should have a get-reward-rate read-only function', () => {
    expect(contractSource).toContain('(define-read-only (get-reward-rate)')
  })
})

