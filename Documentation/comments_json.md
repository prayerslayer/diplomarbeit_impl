# Comment format

    {
      comment_id: <string>,
      component_id: <string>,
      dataset_id: <string>,
      user_id: <string>
      visualized_properties: [ <string> ],
      component_memento: {
        property: value
      },
      versions: [ <version> ]
    }

``comment_id`` is not available when the help system just created it. It will be generated in the backend.

``component_id`` does **not** refer to the component instance id!

# Version format

    {
      timestamp: <long>,
      text: <string>,
      number: <int>,
      annotations: [ <annotation> ]
    }

# Annotation format

## Data based

Range only works when all properties are intrinsically orderable, e.g. temperatures or dates. Not intrinsically orderable: humans, cars, countries etc.

### Data

    {
      type: "data",
      items: [ <item> ]
    }

**Item:**

    {
      uri: <string>,
      from: ?,
      to: ?
    }

### Group

    {
      type: "group",
      points: [ <point> ]
    }

### Point

    {
      type: "point",
      uri: <string>,
      values: {
        <property uri>: <value>
      }
    }

## Area based

    {
      type: "area",
      visualization_width: <int>,
      visualization_height: <int>,
      elements: [ <element> ]
    }

### Text element

    {
      type: "text",
      x: <float>,
      y: <float>,
      text: <string>
    }

### Rectangle element

    {
      type: "rectangle",
      x1: <float>,
      y1: <float>,
      x2: <float>,
      y2: <float>
    }

### Arrow element

    {
      type: "arrow",
      x1: <float>,
      y1: <float>,
      x2: <float>,
      y2: <float>
    }