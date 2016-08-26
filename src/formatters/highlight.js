'use strict';
var React = require('react');

module.exports = function(getHighlights) {
    return function(value) {
        value = String(value); // deals with arrays/numbers/...

        var children = [];
        var highlights = getHighlights(value);
        var currentPosition = 0;
        for (var x = 0; x < highlights.length; x++) {
            var nonMatchingPrefix = value.slice(currentPosition, highlights[x].startIndex);
            var matchingText = value.slice(highlights[x].startIndex, highlights[x].startIndex + highlights[x].length);
            currentPosition = highlights[x].startIndex + highlights[x].length;

            if (nonMatchingPrefix.length > 0) {
                children.push(<span key={x + '-nonmatch'}>{nonMatchingPrefix}</span>);
            }
            children.push(<span className='highlight' key={x + '-match'}>{matchingText}</span>);
        }
        children.push(<span key={x + '-remainder'}>{value != 'null' && value != '[object Object]' ? value.slice(currentPosition) : ''}</span>);
        var progressphoto = '';
        if (value.indexOf('in progress') > -1){
           progressphoto += 'yellow';
        } else if (value.indexOf('done') > -1 || value.indexOf('not needed') > -1) {
            progressphoto += 'green';
        }

        var element = <span className='search-result' data-photoprogress={progressphoto}>{children}</span>;
        return element;
    };
};
