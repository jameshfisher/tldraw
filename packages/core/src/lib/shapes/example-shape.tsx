import {
  TLShapeUtil,
  TLShape,
  Bounds,
  TLRenderInfo,
  TransformInfo,
} from '../types'
import Utils from '../utils'

export class ExampleShape extends TLShapeUtil<TLShape> {
  type = 'shape-type'

  defaultProps = {
    id: 'example',
    type: 'shape-type',
    parentId: 'page',
    childIndex: 0,
    name: 'Example Shape',
    point: [0, 0],
    rotation: 0,
  }

  create(props: Partial<TLShape>) {
    return { ...this.defaultProps, ...props }
  }

  render(shape: TLShape, info: TLRenderInfo): JSX.Element {
    return <rect width={100} height={100} fill="none" stroke="black" />
  }

  shouldRender(prev: TLShape, next: TLShape): boolean {
    return true
  }

  getBounds(shape: TLShape): Bounds {
    return Utils.getFromCache(this.boundsCache, shape, () => ({
      minX: 0,
      minY: 0,
      maxX: 0,
      maxY: 0,
      width: 100,
      height: 100,
    }))
  }

  getRotatedBounds(shape: TLShape) {
    return Utils.getBoundsFromPoints(
      Utils.getRotatedCorners(this.getBounds(shape), shape.rotation)
    )
  }

  getCenter(shape: TLShape): number[] {
    return Utils.getBoundsCenter(this.getBounds(shape))
  }

  hitTest(shape: TLShape, point: number[]) {
    return Utils.pointInBounds(point, this.getBounds(shape))
  }

  hitTestBounds(shape: TLShape, bounds: Bounds) {
    const rotatedCorners = Utils.getRotatedCorners(
      this.getBounds(shape),
      shape.rotation
    )

    return (
      Utils.boundsContainPolygon(bounds, rotatedCorners) ||
      Utils.boundsCollidePolygon(bounds, rotatedCorners)
    )
  }

  transform(
    shape: TLShape,
    bounds: Bounds,
    info: TransformInfo<TLShape>
  ): TLShapeUtil<TLShape> {
    shape.point = [bounds.minX, bounds.minY]
    return this
  }

  transformSingle(
    shape: TLShape,
    bounds: Bounds,
    info: TransformInfo<TLShape>
  ): TLShapeUtil<TLShape> {
    return this.transform(shape, bounds, info)
  }
}
