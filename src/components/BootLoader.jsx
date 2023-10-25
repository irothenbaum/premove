import React, {useState, useEffect} from 'react'
import './BootLoader.scss'
import useDoOnceTimer from '../hooks/useDoOnceTimer'
import {constructClassString} from '../utilities'
import Icon, {CHESS} from './utility/Icon'

const BOOT_TIME = 3000
const FADE_DURATION = 1000

function BootLoader(props) {
  const {setTimer} = useDoOnceTimer()
  const [isReady, setIsReady] = useState(null)
  const [isFading, setIsFading] = useState(false)

  useEffect(() => {
    // TODO: revert this to false to have bootloader render
    setIsReady(true)
  }, [])

  useEffect(() => {
    if (typeof isReady === 'boolean' && !isReady) {
      setTimer(
        'boot-loader-fase',
        () => {
          setIsFading(true)
        },
        BOOT_TIME - FADE_DURATION,
      )

      setTimer(
        'boot-loader',
        () => {
          setIsReady(true)
        },
        BOOT_TIME,
      )
    }
  }, [isReady])

  return isReady ? null : (
    <div
      className={constructClassString('boot-loader', {
        loading: typeof isReady === 'boolean' && !isReady,
        fading: isFading,
        ready: isReady,
      })}>
      <div className="boot-loader-content">
        <Icon icon={CHESS} className="boot-loader-icon" />
        <h1>PREMOVE</h1>
      </div>
    </div>
  )
}

BootLoader.propTypes = {}

export default BootLoader
