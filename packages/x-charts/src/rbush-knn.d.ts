declare module 'rbush-knn' {
  export default function knn(
    tree: any,
    x: number,
    y: number,
    numPoints?: number = Infinity,
  ): number[];
}
