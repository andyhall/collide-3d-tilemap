module.exports = function(field, tilesize, dimensions, offset) {
  dimensions = dimensions || [ 
    Math.sqrt(field.length) >> 0
  , Math.sqrt(field.length) >> 0
  , Math.sqrt(field.length) >> 0
  ] 

  offset = offset || [
    0
  , 0
  , 0
  ]

  field = typeof field === 'function' ? field : function(x, y, z) {
    var i = x + y * dimensions[1] + (z * dimensions[1] * dimensions[2])
    if (i<0 || i>=this.length) return undefined
    return this[i]
  }.bind(field) 

  var coords

  coords = [0, 0, 0]

  return collide

  function ceil(n) {
    return (n===0) ? 0 : Math.ceil(n)
  }
  
  function collide(box, vec, oncollision) {
    // collide x, then y - if vector has a nonzero component
    if(vec[0] !== 0) collideaxis(0, box, vec, oncollision)
    if(vec[1] !== 0) collideaxis(1, box, vec, oncollision)
    if(vec[2] !== 0) collideaxis(2, box, vec, oncollision)
  }

  function collideaxis(i_axis, box, vec, oncollision) {
    var j_axis = (i_axis + 1) % 3
      , k_axis = (i_axis + 2) % 3 
      , posi = vec[i_axis] > 0
      , leading = box[posi ? 'max' : 'base'][i_axis] 
      , dir = posi ? 1 : -1
      , i_start = Math.floor(leading / tilesize)
      , i_end = (Math.floor((leading + vec[i_axis]) / tilesize)) + dir
      , j_start = Math.floor(box.base[j_axis] / tilesize)
      , j_end = ceil(box.max[j_axis] / tilesize)
      , k_start = Math.floor(box.base[k_axis] / tilesize) 
      , k_end = ceil(box.max[k_axis] / tilesize)
      , done = false
      , edge_vector
      , edge
      , tile

    // loop from the current tile coord to the dest tile coord
    //    -> loop on the opposite axis to get the other candidates
    //      -> if `oncollision` return `true` we've hit something and
    //         should break out of the loops entirely.
    //         NB: `oncollision` is where the client gets the chance
    //         to modify the `vec` in-flight.
    // once we're done translate the box to the vec results

    outer: 
    for(var i = i_start; i !== i_end; i += dir) {
      for(var j = j_start; j !== j_end; ++j) {
        for(var k = k_start; k !== k_end; ++k) {
          coords[i_axis] = i
          coords[j_axis] = j
          coords[k_axis] = k
          tile = field(coords[0], coords[1], coords[2])

          if(tile === undefined) continue

          edge = dir > 0 ? i * tilesize : (i + 1) * tilesize
          edge_vector = edge - leading

          if(oncollision(i_axis, tile, coords, dir, edge_vector)) {
            break outer
          }
        } 
      }
    }

    coords[0] = coords[1] = coords[2] = 0
    coords[i_axis] = vec[i_axis]
    box.translate(coords)
  }
}
