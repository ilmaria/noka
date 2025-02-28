pub const Entity = enum(u32) {
    root = std.math.maxInt(u32),
    _,
};

pub const Value = extern union {
    parent: Entity,
    index: u64,
    layout: Layout,
    flags: Flags,
    corner_radius_px: f32,
    boder_width: f32,
    border_color: Color,
    color: Color,
    enabled_if: void, // TODO
    triangle_strip: Length,
    rectangle: Rectangle,
    text: Length,
    text_type: TextType,
    font_family: void, // TODO
    font_size: void, // TODO
};

pub const Length = u32;

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

pub const TextType = enum(u8) {
    body = 15,
    title = 16,
    sub_title = 17,
};

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

test {
    @import("std").testing.refAllDeclsRecursive(@This());
}

const std = @import("std");
