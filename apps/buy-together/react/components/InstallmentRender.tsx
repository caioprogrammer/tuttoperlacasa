import React from 'react'
import { FormattedNumber } from 'react-intl'
import { FormattedCurrency } from 'vtex.format-currency'
import { IOMessageWithMarkers } from 'vtex.native-types'

import { InstallmentItem } from '../typings/types'

export const CSS_HANDLES = [
  'installments',
  'installmentsNumber',
  'installmentValue',
  'installmentsTotalValue',
  'interestRate',
  'paymentSystemName',
] as const

interface Props {
  message: string
  markers: string[]
  installment: InstallmentItem
  handles: any // CssHandlesTypes.CssHandlesBag<typeof CSS_HANDLES>['handles']
}

function InstallmentsRenderer({
  message,
  markers,
  installment,
  handles,
}: Props) {
  const {
    value: Value,
    count: NumberOfInstallments,
    interestRate: InterestRate,
    total: TotalValuePlusInterestRate,
  } = installment

  const hasMoreThanOne = NumberOfInstallments > 1

  const hasInterest = InterestRate !== 0

  const interestRatePercent = InterestRate / 100

  return (
    <span className={handles.installments}>
      <IOMessageWithMarkers
        message={message}
        markers={markers}
        handleBase="installments"
        values={{
          installmentsNumber: (
            <span
              key="installmentsNumber"
              className={handles.installmentsNumber}
            >
              {NumberOfInstallments && (
                <FormattedNumber value={NumberOfInstallments} />
              )}
            </span>
          ),
          installmentValue: (
            <span key="installmentValue" className={handles.installmentValue}>
              <FormattedCurrency value={Value} />
            </span>
          ),
          installmentsTotalValue: (
            <span
              key="installmentsTotalValue"
              className={handles.installmentsTotalValue}
            >
              <FormattedCurrency value={TotalValuePlusInterestRate} />
            </span>
          ),
          interestRate: (
            <span key="interestRate" className={handles.interestRate}>
              {interestRatePercent && (
                <FormattedNumber
                  value={interestRatePercent}
                  style="percent"
                  maximumFractionDigits={2}
                  minimumFractionDigits={0}
                />
              )}
            </span>
          ),
          // paymentSystemName: (
          //   <span key="paymentSystemName" className={handles.paymentSystemName}>
          //     {PaymentSystemName}
          //   </span>
          // ),
          hasInterest,
          hasMoreThanOne,
        }}
      />
    </span>
  )
}

export default InstallmentsRenderer
