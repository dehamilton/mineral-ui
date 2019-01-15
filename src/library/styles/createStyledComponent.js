/* @flow */

import styled from '@emotion/styled';
import withPropsFn from 'recompose/withProps';
import isValidProp from '../utils/isValidProp';

import type { CreateStyledComponent, StyleFn } from './types';

const createStyledComponent: CreateStyledComponent = (
  element,
  styles,
  options = {}
) => {
  const {
    displayName,
    filterProps = [],
    forwardProps = [],
    rootEl,
    withProps
  } = options;
  const outStyles: StyleFn = (props, context) =>
    typeof styles === 'function' ? styles(props, context) : styles;

  const styledComponent = styled(element, {
    ...(process.env.NODE_ENV !== 'production' && displayName
      ? { label: displayName }
      : undefined),
    shouldForwardProp: (prop) => {
      /*
       * These props are filtered in Emotion's default implementation of
       * shouldForwardProp, which this overrides.
       */
      const filteredProps = ['innerRef', 'theme'].concat(filterProps);
      const isFiltered = filteredProps.indexOf(prop) !== -1;
      const isForwarded = forwardProps.indexOf(prop) !== -1;
      const tag = typeof element === 'string' ? element : rootEl;

      return !isFiltered && (isForwarded || isValidProp(tag, prop));
    }
  })(outStyles);

  return withProps ? withPropsFn(withProps)(styledComponent) : styledComponent;
};

export default createStyledComponent;
