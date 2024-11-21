;; Define constants
(define-constant contract-owner tx-sender)
(define-constant err-not-authorized (err u100))

;; Define fungible token
(define-fungible-token stablecoin)

;; Public functions

;; Mint function
(define-public (mint (amount uint) (recipient principal))
  (begin
    (asserts! (is-eq tx-sender contract-owner) err-not-authorized)
    (ft-mint? stablecoin amount recipient)))

;; Transfer function
(define-public (transfer (amount uint) (sender principal) (recipient principal))
  (begin
    (asserts! (is-eq tx-sender sender) err-not-authorized)
    (ft-transfer? stablecoin amount sender recipient)))

;; Read-only functions

(define-read-only (get-balance (account principal))
  (ft-get-balance stablecoin account))

(define-read-only (get-total-supply)
  (ft-get-supply stablecoin))
