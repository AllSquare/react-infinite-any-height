var React = require('react')
var ReactInfinite = require('react-infinite')

var InfiniteAnyHeight = React.createClass({
  getInitialState() {
    return {
      heights: [],
      list: [],
    }
  },

  getDefaultProps() {
    return {
      heightsUpdateCallback: ()=>{},
      heights: [],
    }
  },

  getScrollContainer() {
    if (this.props.useWindowAsScrollContainer)
      return document.body
    return this.props.scrollContainer
  },

  addHeight(i, height) {
    var heights = this.state.heights
    var scrollDiff = height -heights[i]
    if (scrollDiff && this.scrollTopDelta < 0)
      this.getScrollContainer().scrollTop += scrollDiff
    heights[i] = height
    this.props.heightsUpdateCallback(heights)
    this.setState({heights})
  },

  componentDidMount() {
    this.setList(this.props.list)
  },

  componentWillReceiveProps(nextProps) {
    if (nextProps.list != this.props.list)
      this.setList(nextProps.list)
  },

  setList(propsList) {
    var heights = []
    var list =
    propsList.map( (x, i)=>{
      heights[i] = this.state.heights[i] || this.props.heights[i] || 200
      return (
        <GetHeightWrapper
          addHeight={this.addHeight.bind(this, i)}
          key={i}
        >
          {x}
        </GetHeightWrapper>
      )
    })
    this.setState({
      heights,
      list,
    })
  },

  lastScrollTop: 0,
  scrollTopDelta: 0,

  propTypes: {
    heights: React.PropTypes.array,
    heightsUpdateCallback: React.PropTypes.function,
    list: React.PropTypes.node,
    scrollContainer: React.PropTypes.object,
    useWindowAsScrollContainer: React.PropTypes.boolean
  },

  handleScroll() {
    var scrollTop = this.getScrollContainer().scrollTop
    this.scrollTopDelta = scrollTop -this.lastScrollTop
    this.lastScrollTop = scrollTop
  },

  render() {
    return (
      <ReactInfinite
        elementHeight={this.state.heights}
        handleScroll={this.handleScroll}
        {...this.props}
        >
        {this.state.list}
      </ReactInfinite>
    )
  }
})

var GetHeightWrapper = React.createClass({
  getInitialState() {
    return {height: undefined}
  },

  componentDidMount() {
    this.setHeight()
  },

  propTypes: {
    addHeight: React.PropTypes.function,
    children: React.PropTypes.node,
  },

  setHeight() {
    var height = this.node.getBoundingClientRect().height
    this.props.addHeight(height)
  },
  render() {
    var s = {
      content: ' ',
      display: 'block',
      clear: 'both',
    }
    return (
      <span ref={node => this.node = node}
          style={s} className={this.state.height +'-px'}>
        {this.props.children}
      </span>
    )
  }
})

module.exports = InfiniteAnyHeight
