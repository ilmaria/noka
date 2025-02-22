pub const Element = enum(u64) {
    root = std.math.maxInt(u64),
    _,
};

pub const Value = extern union {
    parent: Element,
    index: u64,
    layout: Layout,
    flags: Flags,
    corner_radius: f32,
    color: Color,
    enabled_if: void, // TODO
    triangle_strip: TriangleStrip.Length,
    rectangle: Rectangle,
};

pub const Attribute = FieldEnum(Value, u8);

pub const Layout = enum(u8) {
    vertical_stack = 4,
    horizontal_stack = 5,
    grid = 6,
};

pub const Flags = packed struct(u8) {
    use_rtl: bool,
    remove_previous_children: bool,
    _: u6,
};

pub const Color = extern struct {
    r: u8 = 0,
    g: u8 = 0,
    b: u8 = 0,
    a: u8 = 255,
};

pub const TriangleStrip = struct {
    pub const Vertex = extern struct {
        pos: Point,
        color: Color,
    };
    pub const Index = enum(u32) { _ };
    pub const Length = enum(u32) { _ };
};

pub const Rectangle = extern struct {
    min: Point,
    max: Point,
};

pub const Point = extern struct {
    anchor: enum(u8) {
        top_left = 7,
        top_right = 8,
        bottom_left = 9,
        bottom_right = 10,
    },
    units: enum(u8) {
        all_pixel = 11,
        all_percentage = 12,
        x_pixel_and_y_percentage = 13,
        x_percentage_and_y_pixel = 14,
    },
    x: f64,
    y: f64,
};

// pub const Distance = extern struct {
//     tag: FieldEnum(@This().Value, u8),
//     value: @This().Value,

//     pub const Value = extern union {
//         percentage: f64,
//         pixels: f64,
//     };
// };

pub fn FieldEnum(comptime T: type, tag_type: type) type {
    const fields = @typeInfo(T).@"union".fields;
    var enumFields: [fields.len]std.builtin.Type.EnumField = undefined;
    inline for (fields, 0..) |field, i| {
        enumFields[i] = .{
            .name = field.name ++ "",
            .value = i,
        };
    }
    return @Type(.{
        .@"enum" = .{
            .tag_type = tag_type,
            .fields = &enumFields,
            .decls = &.{},
            .is_exhaustive = true,
        },
    });
}

// pub const Distance = extern struct {
//     anchor: enum(u8) {
//         left,
//         top,
//         right,
//         bottom,
//     },
//     tag: enum(u8) { percentage, pixels },
//     value: extern union {
//         percentage: f64,
//         pixels: f64,
//     },
// };

// pub const Rectangle = extern struct {
//     parent: Container.Id,
//     left: Distance,
//     top: Distance,
//     right: Distance,
//     bottom: Distance,
//     corner_radius: f32,
//     color: Color,
// };

// pub const Container = extern struct {
//     parent: Id,
//     id: Id,
//     index: u64,
//     layout: Layout,
//     flags: Flags,

//     pub const Flags = packed struct(u8) {
//         use_rtl: bool,
//         remove_previous_children: bool,
//         _: u6,
//     };

//     pub const Layout = enum(u8) {
//         vertical_stack,
//         horizontal_stack,
//         grid,
//     };

//     pub const Id = enum(u64) {
//         root = std.math.maxInt(u64),
//         _,
//     };
// };

// pub const GridLayout = extern struct {
//     container: Container.Id,
//     // ...
// };

// pub const Color = extern struct {
//     r: u8 = 0,
//     g: u8 = 0,
//     b: u8 = 0,
//     a: u8 = 255,
// };

// pub const TriangleStrip = struct {
//     pub const Point = extern struct {
//         parent: Container.Id,
//         pos: [2]Distance,
//         color: Color,
//     };
//     pub const Index = enum(u32) { _ };
// };

// pub const ContainerQuery = extern struct {
//     parent: Container.Id,
//     // query: ContainerQuery.Query,
// };

test {
    @import("std").testing.refAllDeclsRecursive(@This());
}

const std = @import("std");
