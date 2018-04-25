const getBase = tag => {
  const re = /(?:MNL_|AUTON_|)(.*?\d+\.\d+)/ig
  const matches = re.exec(tag)
  if (matches) {
    return matches[1]
  } else {
    throw new Error('invalid-tag')
  }
}

export default (tag, sourceName) => {
  return getBase(tag)
  // if (sourceName === 'telaria') {
  //   if (tag.startsWith('MNL_')) {
  //   }
  // } else {
  // }
}
