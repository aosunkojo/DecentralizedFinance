;; contracts/stablecoin.clar

;; Define constants
(define-constant contract-owner tx-sender)
(define-constant err-not-authorized (err u100))
(define-constant err-insufficient-balance (err u101))

;; Define fungible token
(define-fungible-token stablecoin)

;; Define data variables
(define-data-var total-supply uint u0)

;; Public functions

;; Mint function (only contract owner can mint)
(define-public (mint (amount uint) (recipient principal))
  (begin
    (asserts! (is-eq tx-sender contract-owner) err-not-authorized)
    (ft-mint? stablecoin amount recipient)))

;; Transfer function
(define-public (transfer (amount uint) (sender principal) (recipient principal))
  (begin
    (asserts! (is-eq tx-sender sender) err-not-authorized)
    (ft-transfer? stablecoin amount sender recipient)))

;; Burn function
(define-public (burn (amount uint) (sender principal))
  (begin
    (asserts! (is-eq tx-sender sender) err-not-authorized)
    (ft-burn? stablecoin amount sender)))

;; Read-only functions

(define-read-only (get-balance (account principal))
  (ft-get-balance stablecoin account))

(define-read-only (get-total-supply)
  (ft-get-supply stablecoin))
