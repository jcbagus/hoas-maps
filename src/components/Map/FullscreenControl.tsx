import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { useControl } from 'react-map-gl';
import { Map } from 'mapbox-gl';

interface FullscreenControlOptions {
  visible: boolean;
}

function Button() {
  return (
    <a
      role="button"
      id="toggleFullscreenBtn"
      title="Toggle Fullscreen"
      target="_blank"
      rel="noreferrer noopener"
      href={window.location.origin}
      className="button toggle-full-screen-btn custom-map-control-btn"
    >
      <svg
        height="22"
        viewBox="0 0 14 14"
        width="22"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="m2 9h-2v5h5v-2h-3zm-2-4h2v-3h3v-2h-5zm12 7h-3v2h5v-5h-2zm-3-12v2h3v3h2v-5z"
          fillRule="evenodd"
        />
      </svg>
    </a>
  );
}

class FullscreenControlClass {
  node: HTMLDivElement;

  options: FullscreenControlOptions;

  map: Map | undefined;

  constructor(options: FullscreenControlOptions) {
    this.options = options;
    this.node = document.createElement('div');
    this.node.classList.add('mapboxgl-ctrl');
    this.node.classList.add('mapboxgl-ctrl-group');
    this.node.classList.add('mapbox-control');
  }

  insert() {
    this.node.innerHTML = ReactDOMServer.renderToString(<Button />);
  }

  addClassName(className: string) {
    this.node.classList.add(className);
  }

  removeClassName(className: string) {
    this.node.classList.remove(className);
  }

  onAddControl() {
    // extend
    if (this.options.visible) {
      this.insert();
    }
  }

  onRemoveControl() {
    // extend
  }

  onAdd(map: Map) {
    this.map = map;
    this.onAddControl();

    return this.node;
  }

  onRemove() {
    this.onRemoveControl();
    this.node.parentNode?.removeChild(this.node);
  }
}

export default function FullscreenControl(props: FullscreenControlOptions) {
  useControl(() => new FullscreenControlClass(props), {
    position: 'top-right',
  });

  return null;
}
