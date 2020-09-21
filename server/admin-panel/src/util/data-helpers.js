import moment from 'moment'

function getNumBins(data, bucketSizeHours = 1){
  let start = moment(data[0].timestamp)
  let end = moment(data[data.length - 1].timestamp).add(bucketSizeHours, 'hours')
  return Math.floor(end.diff(start, 'hours') / bucketSizeHours)
}

export function getDataBins(data, bucketSizeHours = 1){
  if (!data.length) { return [] }
  let startDate = moment(data[0].timestamp)
  return data.reduce((bins, d) => {
    let date = moment(d.timestamp)
    let index = Math.floor(date.diff(startDate, 'hours') / bucketSizeHours)
    let bin = bins[index]
    bin.push(d)
    return bins
  }, Array(getNumBins(data, bucketSizeHours)).fill(0).map(() => []))
}

export function getBinTimes(data, bucketSizeHours){
  if (!data.length) { return [] }
  let x = []
  let start = moment(data[0].timestamp)
  let end = moment(data[data.length - 1].timestamp).add(bucketSizeHours, 'hours')
  let count = end.diff(start, 'hours') / bucketSizeHours
  for (let i = 0; i < count; i++) {
    let d = start.add(bucketSizeHours, 'hours').toISOString()
    x.push(d)
  }
  return x
}
