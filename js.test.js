// 快排
function quickSort(src, end, begin) {
    if (begin === undefined) begin = 0;
    if (end === undefined) end = src.length;
    if (begin < end) {
        var key = src[begin];
        var i = begin;
        var j = end;
        while (i < j) {
            while (i < j && src[j] > key) {
                j--;
            }
            if (i < j) {
                src[i] = src[j];
                i++;
            }
            while (i < j && src[i] < key) {
                i++;
            }
            if (i < j) {
                src[j] = src[i];
                j--;
            }
        }
        src[i] = key;
        // console.log(key)
        quickSort(src, i - 1, begin);
        quickSort(src, end, i + 1);
    }
}
// 插入排序
function insertSort(arr, len) {
    for (var i = 0; i <= len; i++) {
        var tmp = arr[i], j;
        for (j = i - 1; j >= 0; j--) {
            //如果比tmp大把值往后移动一位
            if (arr[j] > tmp) {
                arr[j + 1] = arr[j];
            }
            else {
                break;
            }
        }
        // console.log(tmp)
        arr[j + 1] = tmp;
    }
}
// 插入排序;
function insert(array, num) {
    for (var i = 0; i < num; i++) {
        for (var j = i + 1; j > 0; j--) {
            if (array[j] < array[j - 1]) { // 一直找到前一个位置不再大于插入数据的位置进行交换,在这之前前面的数组已经保证是有序的了;
                var temp = array[j];
                array[j] = array[j - 1];
                array[j - 1] = temp;
            } else {
                break; // 增加这个break可以提高插入排序的速度;
            }
        }
    }
}
// 插入排序改进：二分插入排序
function binaryInsertSort(a, len) {
    var key, left, right, middle;
    for (var i = 1; i <= len; i++) {
        key = a[i];
        left = 0;
        right = i - 1;
        while (left <= right) {
            middle = ((left + right) / 2) >> 0;
            if (a[middle] > key)
                right = middle - 1;
            else
                left = middle + 1;
        }

        for (var j = i - 1; j >= left; j--) {
            a[j + 1] = a[j];
        }
        // console.log(key)
        a[left] = key;
    }
}
// 希尔
function shellSort(arrays, len) {
    var offset = Math.max(1, Math.ceil(len / 2)) + 1, length = arrays.length;

    for (var step = (length / offset) >> 0; step > 0; step = (step / offset) >> 0) {

        //从增量那组开始进行插入排序，直至完毕
        for (var i = step; i < length; i++) {

            var j = i;
            var temp = arrays[j];

            // j - step 就是代表与它同组隔壁的元素
            while (j - step >= 0 && arrays[j - step] > temp) {
                arrays[j] = arrays[j - step];
                j = j - step;
            }
            arrays[j] = temp;
        }
    }
}
function shellSort2(arr) {
    var len = arr.length,
        temp,
        gap = 1;
    while (gap < len / 3) {          //动态定义间隔序列
        gap = gap * 3 + 1;
    }
    for (gap; gap > 0; gap = Math.floor(gap / 3)) {
        for (var i = gap; i < len; i++) {
            temp = arr[i];
            for (var j = i - gap; j >= 0 && arr[j] > temp; j -= gap) {
                arr[j + gap] = arr[j];
            }
            arr[j + gap] = temp;
        }
    }
    return arr;
}
// 归并
function mergeSort(arr) {  // 采用自上而下的递归方法
    var len = arr.length;
    if (len < 2) {
        return arr;
    }
    var middle = Math.floor(len / 2),
        left = arr.slice(0, middle),
        right = arr.slice(middle);
    return merge(mergeSort(left), mergeSort(right));
}
function merge(left, right) {
    var result = [];

    while (left.length && right.length) {
        if (left[0] <= right[0]) {
            result.push(left.shift());
        } else {
            result.push(right.shift());
        }
    }

    while (left.length)
        result.push(left.shift());

    while (right.length)
        result.push(right.shift());

    return result;
}
// 选择排序
function selectionSort(arr) {
    var len = arr.length;
    var minIndex, temp;
    for (var i = 0; i < len - 1; i++) {
        minIndex = i;
        for (var j = i + 1; j < len; j++) {
            if (arr[j] < arr[minIndex]) {     // 寻找最小的数
                minIndex = j;                 // 将最小数的索引保存
            }
        }
        temp = arr[i];
        arr[i] = arr[minIndex];
        arr[minIndex] = temp;
    }
    return arr;
}
// 桶排序
function bucketSort(arr, bucketSize) {
    if (arr.length === 0) {
        return arr;
    }

    var i;
    var minValue = arr[0];
    var maxValue = arr[0];
    for (i = 1; i < arr.length; i++) {
        if (arr[i] < minValue) {
            minValue = arr[i];                // 输入数据的最小值
        } else if (arr[i] > maxValue) {
            maxValue = arr[i];                // 输入数据的最大值
        }
    }

    //桶的初始化
    var DEFAULT_BUCKET_SIZE = 5;            // 设置桶的默认数量为5
    bucketSize = bucketSize || DEFAULT_BUCKET_SIZE;
    var bucketCount = Math.floor((maxValue - minValue) / bucketSize) + 1;
    var buckets = new Array(bucketCount);
    for (i = 0; i < buckets.length; i++) {
        buckets[i] = [];
    }

    //利用映射函数将数据分配到各个桶中
    for (i = 0; i < arr.length; i++) {
        buckets[Math.floor((arr[i] - minValue) / bucketSize)].push(arr[i]);
    }

    arr.length = 0;
    for (i = 0; i < buckets.length; i++) {
        insert(buckets[i]);                      // 对每个桶进行排序，这里使用了插入排序
        for (var j = 0; j < buckets[i].length; j++) {
            arr.push(buckets[i][j]);
        }
    }

    return arr;
}
function radixSort(arr, maxDigit) {
    var counter = [];
    var mod = 10;
    var dev = 1;
    for (var i = 0; i < maxDigit; i++, dev *= 10, mod *= 10) {
        for (var j = 0; j < arr.length; j++) {
            var bucket = parseInt((arr[j] % mod) / dev);
            if (counter[bucket] == null) {
                counter[bucket] = [];
            }
            counter[bucket].push(arr[j]);
        }
        var pos = 0;
        for (var j = 0; j < counter.length; j++) {
            var value = null;
            if (counter[j] != null) {
                while ((value = counter[j].shift()) != null) {
                    arr[pos++] = value;
                }
            }
        }
    }
    return arr;
}

function bubbleSort(arr) {
    var len = arr.length;
    for (var i = 0; i < len - 1; i++) {
        for (var j = 0; j < len - 1 - i; j++) {
            if (arr[j] > arr[j + 1]) {        // 相邻元素两两对比
                var temp = arr[j + 1];        // 元素交换
                arr[j + 1] = arr[j];
                arr[j] = temp;
            }
        }
    }
    return arr;
}

var len;    // 因为声明的多个函数都需要数据长度，所以把len设置成为全局变量

function buildMaxHeap(arr) {   // 建立大顶堆
    len = arr.length;
    for (var i = Math.floor(len / 2); i >= 0; i--) {
        heapify(arr, i);
    }
}

function heapify(arr, i) {     // 堆调整
    var left = 2 * i + 1,
        right = 2 * i + 2,
        largest = i;

    if (left < len && arr[left] > arr[largest]) {
        largest = left;
    }

    if (right < len && arr[right] > arr[largest]) {
        largest = right;
    }

    if (largest != i) {
        swap(arr, i, largest);
        heapify(arr, largest);
    }
}

function swap(arr, i, j) {
    var temp = arr[i];
    arr[i] = arr[j];
    arr[j] = temp;
}

function heapSort(arr) {
    buildMaxHeap(arr);

    for (var i = arr.length - 1; i > 0; i--) {
        swap(arr, 0, i);
        len--;
        heapify(arr, 0);
    }
    return arr;
}

var mode = [9, 7, 6, 5, 4, 3, 70, 10, 33, 199, 22, 331, 2, 1, 0, -2, -10, -100]//.sort();

function Task(list, exec) {
    if (exec instanceof Function) {
        var count = 200000;
        console.log();
        console.log(exec.name, '-> //循环::', count);
        var T = Date.now(), tm;
        console.log('源数据', JSON.stringify(list));
        while (count--) {
            list = list.slice(0);
            tm = exec(list, list.length - 1);
        }
        console.log('排序后', JSON.stringify(tm || list));
        console.log('用时', Date.now() - T, 'ms');
    }
    return list;
}


// Task(mode, heapSort);
// Task(mode, binaryInsertSort);

// Task(mode, insert);
// // Task(mode, insertSort);
// Task(mode, selectionSort);

// Task(mode, bucketSort);


// Task(mode, bubbleSort);

Task(mode, quickSort);
Task(mode, shellSort);
// Task(mode, shellSort2);
// Task(mode, mergeSort);
// Task(mode, radixSort);

Task(mode, function arrayOwnSort(list, l) {

    // shellSort(list, l);
    list.sort((a, b) => {
        return a > b ? 1 : -1
    })
    return list;
});

// 200000循环
// binaryInsertSort
// 源数据 [9,7,6,5,4,3,70,10,33,199,22,331,2,1,0,-1,-100]
// 排序后 [-100,-1,0,1,2,3,4,5,6,7,9,10,22,33,70,199,331]
// 用时 75 ms

// insert
// 源数据 [9,7,6,5,4,3,70,10,33,199,22,331,2,1,0,-1,-100]
// 排序后 [-100,-1,0,1,2,3,4,5,6,7,9,10,22,33,70,199,331]
// 用时 28 ms

// insertSort
// 源数据 [9,7,6,5,4,3,70,10,33,199,22,331,2,1,0,-1,-100]
// 排序后 [-100,-1,0,1,2,3,4,5,6,7,9,10,22,33,70,199,331]
// 用时 28 ms

// quickSort
// 源数据 [9,7,6,5,4,3,70,10,33,199,22,331,2,1,0,-1,-100]
// 排序后 [-100,-1,0,1,2,3,4,5,6,7,9,10,22,33,70,199,331]
// 用时 135 ms

// shellSort
// 源数据 [9,7,6,5,4,3,70,10,33,199,22,331,2,1,0,-1,-100]
// 排序后 [-100,-1,0,1,2,3,4,5,6,7,9,10,22,33,70,199,331]
// 用时 51 ms