declare namespace PF {
    interface Options{
        allowDiagonal?:boolean,
        dontCrossCorners?:boolean,
        heuristic?:Function
    }
    class AStarFinder {
        constructor(t?: Options);
        findPath(t: number, e: number, r: number, o: number, s: Grid): any;
    }
    class BestFirstFinder {
        constructor(t?: Options);
        heuristic(t: any, e: any): any;
    }
    class BiAStarFinder {
        constructor(t?: Options);
        findPath(t: any, e: any, r: any, o: any, s: any): any;
    }
    class BiBestFirstFinder {
        constructor(t?: Options);
        heuristic(t: any, e: any): any;
    }
    class BiBreadthFirstFinder {
        constructor(t?: Options);
        findPath(t: any, e: any, r: any, n: any, o: any): any;
    }
    class BiDijkstraFinder {
        constructor(t?: Options);
        heuristic(t: any, e: any): any;
    }
    class BreadthFirstFinder {
        constructor(t?: Options);
        findPath(t: any, e: any, r: any, n: any, o: any): any;
    }
    class DijkstraFinder {
        constructor(t?: Options);
        heuristic(t: any, e: any): any;
    }
    class Grid {
        constructor(t: any, e?: any, r?: any);
        clone(): any;
        getNeighbors(t: any, e: any, r: any): any;
        getNodeAt(t: any, e: any): any;
        isInside(t: any, e: any): any;
        isWalkableAt(t: any, e: any): any;
        setWalkableAt(t: any, e: any, r: any): void;
    }
    class Heap {
        constructor(t: any);
        clear(): any;
        clone(): any;
        contains(t: any): any;
        copy(): any;
        empty(): any;
        front(): any;
        has(t: any): any;
        heapify(): any;
        insert(t: any): any;
        peek(): any;
        pop(): any;
        push(t: any): any;
        pushpop(t: any): any;
        remove(): any;
        replace(t: any): any;
        size(): any;
        toArray(): any;
        top(): any;
        updateItem(t: any): any;
    }
    class IDAStarFinder {
        constructor(t: any);
        findPath(t: any, e: any, r: any, i: any, o: any): any;
    }
    class JumpPointFinder {
        constructor(t: any);
        findPath(t: any, e: any, r: any, o: any, s: any): any;
    }
    class Node {
        constructor(t: any, e: any, r: any);
    }
    class OrthogonalJumpPointFinder {
        constructor(t: any);
        heuristic(t: any, e: any): any;
    }
    namespace Heap {
        function heapify(t: any, e: any): any;
        function nlargest(t: any, e: any, i: any): any;
        function nsmallest(t: any, e: any, i: any): any;
        function pop(t: any, e: any): any;
        function push(t: any, e: any, i: any): any;
        function pushpop(t: any, e: any, i: any): any;
        function replace(t: any, e: any, i: any): any;
    }
    namespace Heuristic {
        function chebyshev(t: any, e: any): any;
        function euclidean(t: any, e: any): any;
        function manhattan(t: any, e: any): any;
        function octile(t: any, e: any): any;
    }
    namespace Util {
        function backtrace(t: any): any;
        function biBacktrace(t: any, e: any): any;
        function compressPath(t: any): any;
        function expandPath(t: any): any;
        function interpolate(t: any, e: any, r: any, i: any): any;
        function pathLength(t: any): any;
        function smoothenPath(t: any, e: any): any;
    }
}
