import "leaflet";
import "leaflet-draw";

declare module "leaflet" {
  namespace Control {
    class Draw extends Control {
      constructor(options?: Control.DrawConstructorOptions);
    }

    interface DrawConstructorOptions {
      position?: ControlPosition;
      draw?: DrawOptions;
      edit?: EditOptions;
    }
  }

  namespace DrawEvents {
    interface Created {
      layerType: string;
      layer: Layer;
    }
  }

  namespace Draw {
    const Event: {
      CREATED: "draw:created";
      EDITED: "draw:edited";
      DELETED: "draw:deleted";
    };
  }
}
