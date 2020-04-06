// Copyright (c) 2019 Gonzalo Müller Bravo.
import { NamedReducer, useNamedReducer, useNamedReducerContext, useReducerDispatcher, useReducerState } from '../../main/js/NamedReducer'
import React, { useContext } from 'react'

import { mount } from 'enzyme'

describe('NamedReducer tests', () => {
  it('should render', () => {
    const testInitialState = {}
    const testReduce = () => {}

    const context = mount(
      <NamedReducer
        name='testNamedReducer0'
        reducer={testReduce}
        initialState={testInitialState}
      >
        <div>Child</div>
      </NamedReducer>
    )

    expect(context).toHaveText('Child')
    expect(context).toHaveProp('name', 'testNamedReducer0')
    expect(context).toHaveProp('reducer', testReduce)
    expect(context).toHaveProp('initialState', testInitialState)
  })

  it('should get context', () => {
    const testInitialState = '0'
    function testReduce(prevState, action) {
      switch (action) {
        case 'ACTION1':
          return '1'
        default:
          return prevState
      }
    }
    const FunComponent = () => {
      const { state, dispatch } = useNamedReducer('testNamedReducer2')
      return (
        <button onClick={() => dispatch('ACTION1')}>
          Child{state}
        </button>
      )
    }
    const context = mount(
      <NamedReducer
        name='testNamedReducer2'
        reducer={testReduce}
        initialState={testInitialState}
      >
        <FunComponent />
      </NamedReducer>
    )

    expect(context).toHaveText('Child0')

    context.find('button').simulate('click')
    context.update()

    expect(context).toHaveText('Child1')
  })

  it('should get state', () => {
    const testInitialState = '0'
    function testReduce(prevState, action) {
      switch (action) {
        case 'ACTION1':
          return '1'
        default:
          return prevState
      }
    }
    const FunComponent = () => {
      const theState = useReducerState('testNamedReducer3')
      return (
        <button>
          Child{theState}
        </button>
      )
    }
    const context = mount(
      <NamedReducer
        name='testNamedReducer3'
        reducer={testReduce}
        initialState={testInitialState}
      >
        <FunComponent />
      </NamedReducer>
    )

    expect(context).toHaveText('Child0')
  })

  it('should get dispatch', () => {
    const testInitialState = '0'
    const mockReducer = jasmine.createSpy()
    const FunComponent = () => {
      const theDispatcher = useReducerDispatcher('testNamedReducer4')
      return (
        <button onClick={() => theDispatcher('ACTION1')}>
          Child
        </button>
      )
    }
    const context = mount(
      <NamedReducer
        name='testNamedReducer4'
        reducer={mockReducer}
        initialState={testInitialState}
      >
        <FunComponent />
      </NamedReducer>
    )

    context.find('button').simulate('click')
    expect(mockReducer).toHaveBeenCalled()
  })

  it('should reduce with Consumer - Deprecated', () => {
    const testInitialState = '0'
    function testReduce(prevState, action) {
      switch (action) {
        case 'ACTION1':
          return '1'
        default:
          return prevState
      }
    }
    const FunComponent = () => {
      const TestNamedReducer = useNamedReducerContext('testNamedReducer1')
      return (
        <TestNamedReducer.Consumer>
          {
            ([state, dispatch]) => (
              <button onClick={() => dispatch('ACTION1')}>
                Child{state}
              </button>
            )
          }
        </TestNamedReducer.Consumer>
      )
    }
    const context = mount(
      <NamedReducer
        name='testNamedReducer1'
        reducer={testReduce}
        initialState={testInitialState}
      >
        <FunComponent />
      </NamedReducer>
    )

    expect(context).toHaveText('Child0')

    context.find('button').simulate('click')
    context.update()

    expect(context).toHaveText('Child1')
  })

  it('should reduce with traditional useContext - Deprecated', () => {
    const testInitialState = '0'
    function testReduce(prevState, action) {
      switch (action) {
        case 'ACTION1':
          return '1'
        default:
          return prevState
      }
    }
    const FunComponent = () => {
      const [state, dispatch] = useContext(useNamedReducerContext('testNamedReducer1'))
      return (
        <button onClick={() => dispatch('ACTION1')}>
          Child{state}
        </button>
      )
    }
    const context = mount(
      <NamedReducer
        name='testNamedReducer1'
        reducer={testReduce}
        initialState={testInitialState}
      >
        <FunComponent />
      </NamedReducer>
    )

    expect(context).toHaveText('Child0')

    context.find('button').simulate('click')
    context.update()

    expect(context).toHaveText('Child1')
  })

  it('should get nested contexts', () => {
    const testInitialState = '0'
    function testReduce(prevState, action) {
      switch (action) {
        case 'ACTION1':
          return '1'
        default:
          return prevState
      }
    }
    const FunComponent = (props) => {
      const { state, dispatch } = useNamedReducer(props.reducer)
      return (
        <button
          id={props.id}
          onClick={() => dispatch('ACTION1')}
        >
          Child{props.id}{state}
        </button>
      )
    }

    const context = mount(
      <NamedReducer
        name='testNamedReducer7'
        reducer={testReduce}
        initialState={testInitialState}
      >
        <FunComponent
          id='A'
          reducer='testNamedReducer7'
        />
        <NamedReducer
          name='testNamedReducer8'
          reducer={testReduce}
          initialState={testInitialState}
        >
          <FunComponent
            id='B'
            reducer='testNamedReducer8'
          />
        </NamedReducer>
      </NamedReducer>
    )

    expect(context).toHaveText('ChildA0ChildB0')

    context.find('button[id="B"]').simulate('click')
    context.update()

    expect(context).toHaveText('ChildA0ChildB1')
  })
})
