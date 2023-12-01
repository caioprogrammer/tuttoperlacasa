import React, { useEffect, useState } from 'react';
import { useCssHandles } from 'vtex.css-handles';
import {IOMessageWithMarkers} from 'vtex.native-types'

import classNames from 'classnames'
import { Shipping } from '../typings';

const CSS_HANDLES = [
  "StatusIndicatorWrapper",
  "StatusIndicatorText",
  "StatusIndicatorText--active",
  "StatusIndicatorText--success",
  "StatusIndicatorText--fail",
]

interface StatusIndicatorProps {
  successMessage: string;
  failMessage: string;
  markers: string[];
  activeTime: number;
  data: any,
  postalCode: string
  loading: boolean
}

function StatusIndicator({
    successMessage="Frete calculado!",
    failMessage="Não encontramos informações de frete para esse CEP",
    markers,
    activeTime=3000,
    data,
    postalCode,
    loading
  }: StatusIndicatorProps){
  const [isActive, setIsActive] = useState(false)
  const [succeded, setSucceded] = useState(false)

  const shipping: Shipping = data?.shipping
  const handles = useCssHandles(CSS_HANDLES)

  const textClasses = classNames(handles["StatusIndicatorText"], {
    [handles[`StatusIndicatorText--success`]]: succeded,
    [handles[`StatusIndicatorText--fail`]]: !succeded,
    [handles[`StatusIndicatorText--active`]]: isActive,
  })

  useEffect(() => {
    const slaList = shipping?.logisticsInfo?.reduce(
      (slas, info) => [...slas, ...info.slas],
      [] as any
    )

    if(!slaList) return


    if(!loading) {
      setIsActive(true)
    }

    if(!slaList || slaList.length === 0) {
      setSucceded(false)
    } else {
      setSucceded(true)
    }
  }, [data, postalCode])

  useEffect(() => {
    console.log("laoding asdfads", loading)
    if(loading) return

    setIsActive(true)
  }, [succeded, loading])

  useEffect(() => {
    if(!isActive) return

    setTimeout(() => {
      setIsActive(false)
    }, activeTime)
  }, [isActive])

  if(!data) return null

  console.log("Shipping state indicator loaded")

  return (
    <div className={handles["StatusIndicatorWrapper"]}>
      {
        <span className={textClasses}>
          <IOMessageWithMarkers message={succeded ? successMessage : failMessage} markers={markers} handleBase={handles["StatusIndicatorText"]} values={{}}/>
        </span>
      }
    </div>
  )
}

export default StatusIndicator;
