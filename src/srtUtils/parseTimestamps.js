/**
 * Module dependencies.
 */

import toMS from './toMs'
/**
 * Timestamp regex
 * @type {RegExp}
 */

const RE = /^(\d{2}:\d{2}:\d{2},\d{3}) --> (\d{2}:\d{2}:\d{2},\d{3})$/

/**
 * parseTimestamps
 * @param value
 * @returns {{start: Number, end: Number}}
 */
function parseTimestamps (value) {
  const match = RE.exec(value)
  return {
    start: toMS(match[1]),
    end: toMS(match[2])
  }
}

export default parseTimestamps
