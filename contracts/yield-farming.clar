;; contracts/yield-farming.clar

;; Define constants
(define-constant contract-owner tx-sender)
(define-constant err-not-authorized (err u100))
(define-constant err-insufficient-balance (err u101))

;; Define data variables
(define-data-var total-staked uint u0)
(define-data-var reward-rate uint u100) ;; 1% per block

;; Define maps
(define-map user-stakes { user: principal } { amount: uint, last-update: uint })

;; Public functions

;; Stake function
(define-public (stake (amount uint))
  (let (
    (current-stake (default-to { amount: u0, last-update: block-height } (map-get? user-stakes { user: tx-sender })))
    (new-stake (+ (get amount current-stake) amount))
  )
    (try! (stx-transfer? amount tx-sender (as-contract tx-sender)))
    (map-set user-stakes { user: tx-sender } { amount: new-stake, last-update: block-height })
    (var-set total-staked (+ (var-get total-staked) amount))
    (ok amount)))

;; Unstake function
(define-public (unstake (amount uint))
  (let (
    (current-stake (default-to { amount: u0, last-update: block-height } (map-get? user-stakes { user: tx-sender })))
    (new-stake (- (get amount current-stake) amount))
  )
    (asserts! (<= amount (get amount current-stake)) err-insufficient-balance)
    (try! (as-contract (stx-transfer? amount tx-sender tx-sender)))
    (map-set user-stakes { user: tx-sender } { amount: new-stake, last-update: block-height })
    (var-set total-staked (- (var-get total-staked) amount))
    (ok amount)))

;; Claim rewards function
(define-public (claim-rewards)
  (let (
    (current-stake (default-to { amount: u0, last-update: block-height } (map-get? user-stakes { user: tx-sender })))
    (blocks-passed (- block-height (get last-update current-stake)))
    (reward-amount (/ (* (get amount current-stake) (var-get reward-rate) blocks-passed) u10000))
  )
    (try! (as-contract (stx-transfer? reward-amount tx-sender tx-sender)))
    (map-set user-stakes { user: tx-sender } { amount: (get amount current-stake), last-update: block-height })
    (ok reward-amount)))

;; Read-only functions

(define-read-only (get-user-stake (user principal))
  (default-to { amount: u0, last-update: block-height } (map-get? user-stakes { user: user })))

(define-read-only (get-total-staked)
  (var-get total-staked))

(define-read-only (get-reward-rate)
  (var-get reward-rate))
