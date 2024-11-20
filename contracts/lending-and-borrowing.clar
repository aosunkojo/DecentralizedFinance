;; contracts/lending-and-borrowing.clar

;; Define constants
(define-constant contract-owner tx-sender)
(define-constant err-not-authorized (err u100))
(define-constant err-insufficient-balance (err u101))
(define-constant err-insufficient-collateral (err u102))

;; Define data variables
(define-data-var lending-pool uint u0)

;; Define maps
(define-map user-deposits principal uint)
(define-map user-borrows principal uint)
(define-map user-collateral principal uint)

;; Public functions

;; Deposit function
(define-public (deposit (amount uint))
  (let ((current-balance (default-to u0 (map-get? user-deposits tx-sender))))
    (try! (stx-transfer? amount tx-sender (as-contract tx-sender)))
    (map-set user-deposits tx-sender (+ current-balance amount))
    (var-set lending-pool (+ (var-get lending-pool) amount))
    (ok amount)))

;; Withdraw function
(define-public (withdraw (amount uint))
  (let ((current-balance (default-to u0 (map-get? user-deposits tx-sender))))
    (asserts! (<= amount current-balance) err-insufficient-balance)
    (try! (as-contract (stx-transfer? amount tx-sender tx-sender)))
    (map-set user-deposits tx-sender (- current-balance amount))
    (var-set lending-pool (- (var-get lending-pool) amount))
    (ok amount)))

;; Borrow function
(define-public (borrow (amount uint))
  (let (
    (collateral (default-to u0 (map-get? user-collateral tx-sender)))
    (current-borrows (default-to u0 (map-get? user-borrows tx-sender)))
  )
    (asserts! (>= (* collateral u2) (+ current-borrows amount)) err-insufficient-collateral)
    (try! (as-contract (stx-transfer? amount tx-sender tx-sender)))
    (map-set user-borrows tx-sender (+ current-borrows amount))
    (var-set lending-pool (- (var-get lending-pool) amount))
    (ok amount)))

;; Repay function
(define-public (repay (amount uint))
  (let ((current-borrows (default-to u0 (map-get? user-borrows tx-sender))))
    (try! (stx-transfer? amount tx-sender (as-contract tx-sender)))
    (map-set user-borrows tx-sender (- current-borrows amount))
    (var-set lending-pool (+ (var-get lending-pool) amount))
    (ok amount)))

;; Add collateral function
(define-public (add-collateral (amount uint))
  (let ((current-collateral (default-to u0 (map-get? user-collateral tx-sender))))
    (try! (stx-transfer? amount tx-sender (as-contract tx-sender)))
    (map-set user-collateral tx-sender (+ current-collateral amount))
    (ok amount)))

;; Read-only functions

(define-read-only (get-user-deposits (user principal))
  (default-to u0 (map-get? user-deposits user)))

(define-read-only (get-user-borrows (user principal))
  (default-to u0 (map-get? user-borrows user)))

(define-read-only (get-user-collateral (user principal))
  (default-to u0 (map-get? user-collateral user)))

(define-read-only (get-lending-pool-balance)
  (var-get lending-pool))