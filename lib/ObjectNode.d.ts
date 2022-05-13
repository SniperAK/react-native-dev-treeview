import React from 'react';
import VObject from './VObject';
export default function ObjectNode({ object, onNodeExtend }: {
    object: VObject;
    onNodeExtend?: (object: VObject) => void;
}): React.ReactElement;
