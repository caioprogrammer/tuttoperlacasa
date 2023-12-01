export const blockClassModify = (
  blockClass: string | string[],
  baseClass: string
) => {
  if (!blockClass) return baseClass

  if (!Array.isArray(blockClass)) return `${baseClass}--${blockClass}`

  return blockClass
    .map((blockClassModifier) => `${baseClass}--${blockClassModifier}`)
    .join(' ')
}
