export const WaterPoloSettings = {
  periodLengthMS: 480000,
  shotClockMS: 30000,
}

export const BasketballSettings = {
  periodLengthMS: 720000,
  shotClockMS: 24000,
}

export const PRESET_Water_Polo = 'waterpolo'
export const PRESET_Basketball = 'basketball'

export const presetToSettings = {
  [PRESET_Water_Polo]: WaterPoloSettings,
  [PRESET_Basketball]: BasketballSettings,
}

export const presetToLabel = {
  [PRESET_Water_Polo]: 'Water Polo',
  [PRESET_Basketball]: 'Basketball',
}

export const allPresets = [PRESET_Water_Polo, PRESET_Basketball]
