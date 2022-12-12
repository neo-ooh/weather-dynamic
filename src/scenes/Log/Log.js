import React, { Component } from 'react'

class Log extends Component {
  render () {
    return (
      <section id="log-block">
        {this.props.logs.map((log, i) => (
          <p key={i}>{log}</p>
        ))}
      </section>
    )
  }
}

export default Log
