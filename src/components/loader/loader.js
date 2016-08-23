import React, { PropTypes, Component } from 'react';
import '../../../browser/css/loader.css';


class Loader extends Component {
  static defaultProps = {
    loader: false,
    loaderMsg: ''
  }
  static propTypes = {
    loader: PropTypes.bool.isRequired
  }
  render() {
    const loaderOverlay = {
      "left": 0,
      "top": 0,
      "right": 0,
      "bottom": 0,
      position: "fixed",
      backgroundColor: 'rgba(0,0,0,0.4)',
      zIndex: 100
    }
    const loading = {
      letterSpacing: "normal",
      marginLeft: "14px"
    }
    return (
        <div>
            <div className="loader-overlay" style={loaderOverlay}>
              <div className="centered btn btn-lg btn-warning">
                <span className="glyphicon glyphicon-refresh spinning">
                </span>
                <span style={loading}> Loading... {this.props.loaderMsg} </span>
              </div>
            </div>
        </div>
    );
  }
}
module.exports = Loader;
