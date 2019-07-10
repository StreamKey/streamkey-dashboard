export default tag => {
  const re = /(?:MNL_|AUTON_|)(.*?\d+\.\d+)/ig
  const matches = re.exec(tag.toUpperCase())
  if (matches) {
    return matches[1]
  } else {
    throw new Error('invalid-tag')
  }
}
