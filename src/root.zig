pub const Distance = extern struct {
    anchor: enum(u8) {
        left,
        top,
        right,
        bottom,
    },
    tag: enum(u8) { percentage, pixels },
    value: extern union {
        percentage: f64,
        pixels: f64,
    },
};

pub const Rectangle = extern struct {
    parent: Container.Id,
    left: Distance,
    top: Distance,
    right: Distance,
    bottom: Distance,
    corner_radius: f32,
    color: Color,
};

pub const Container = extern struct {
    parent: Id,
    id: Id,
    index: u64,
    layout: Layout,

    pub const Layout = enum(u8) {
        vertical_stack,
        horizontal_stack,
        grid,
    };

    pub const Id = enum(u64) {
        root = std.math.maxInt(u64),
        _,
    };
};

pub const GridLayout = extern struct {
    container: Container.Id,
    // ...
};

pub const Color = extern struct {
    r: u8 = 0,
    g: u8 = 0,
    b: u8 = 0,
    a: u8 = 255,
};

pub const TriangleStrip = struct {
    pub const Point = extern struct {
        parent: Container.Id,
        pos: [2]Distance,
        color: Color,
    };
    pub const Index = enum(u32) { _ };
};

pub const ContainerQuery = extern struct {
    parent: Container.Id,
    // query: ContainerQuery.Query,
};

test {
    @import("std").testing.refAllDeclsRecursive(@This());
}

const std = @import("std");
