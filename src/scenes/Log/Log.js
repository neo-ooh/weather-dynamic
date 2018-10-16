import React, { Component } from 'react'

class Log extends Component {
  hashCode = txt => {
    let hash = 0
    let i, chr
    if (txt.length === 0) return hash
    for (i = 0; i < txt.length; i++) {
      chr = txt.charCodeAt(i)
      hash = ((hash << 5) - hash) + chr
      hash |= 0 // Convert to 32bit integer
    }
    return hash
  }

  render () {
    return (
      <section id="log-block">
        {this.props.logs.map(log => (
          <p key={this.hashCode(log)}>{log}</p>
        ))}
      </section>
    )
  }
}

export default Log
