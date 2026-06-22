export const calculateRiskLevel = (probabilidad, consecuencia) => {
  const prob = Number(probabilidad) || 0
  const cons = Number(consecuencia) || 0
  return prob * cons
}

export const classifyRisk = (nivel) => {
  if (nivel <= 5) return 'Bajo'
  if (nivel <= 10) return 'Medio'
  if (nivel <= 15) return 'Alto'
  return 'Muy alto'
}
