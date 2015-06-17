module.exports = getDistance

function getDistance(a, b, TypedArray) {
  return new Promise(getDistanceData)

  function getDistanceData(resolve, reject) {
    var aData = null

    a.then(_aData => {
      aData = _aData
      return b
    }).then(bData => {
      var data = new TypedArray(aData)

      for (var i = 0; i < data.length; i++) {
        data[i] -= bData[i]
      }

      resolve(data)
    }).catch(reject)
  }
}
