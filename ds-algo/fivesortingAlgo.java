//this consist bubble sort,selection sort,insertion sort,merge sort,quick sort
public class fivesortingAlgo{
	//print arr
	public static  void printArr(int arr[]){
		for(int i=0;i<arr.length;i++){
			System.out.print(arr[i]+",");
		}
		System.out.println();
	}
	//bubble sort
	public static int[] bubbleSort(int arr[]){
		boolean flag=false;
		for(int i=0;i<arr.length;i++){
			for(int j=0;j<arr.length-1-i;j++){
				if(arr[j+1]<arr[j]){
					int temp=arr[j];
					arr[j]=arr[j+1];
					arr[j+1]=temp;
					flag=true;
				}
				 
			}
			if(flag==false){
				return arr;
			}
		}
		return arr;
	}
	//selection sort
	public static int[] selectionSort(int arr[]){
		for(int i=0;i<arr.length-1;i++){
			for(int j=i+1;j<arr.length;j++){
				if(arr[i]>arr[j]){
					int temp=arr[i];
					arr[i]=arr[j];
					arr[j]=temp;
				}
			}
		}
		return arr;
	}
	//insertion sort
	public static int[] insertionSort(int arr[]){
		for(int i=1;i<arr.length;i++){
			int value=arr[i];
			int j=i-1;
			while(j>=0 && arr[j]>value){
				arr[j+1]=arr[j];
				j--;
			}
			arr[j+1]=value;
		}
		return arr;
	}
	//merge sort
	public static void mergeSort(int arr[],int start,int end){
		if(start>=end){
			return ;
		}
		//use recursion 
		int mid=start+(end-start)/2;
		mergeSort(arr,start,mid);
		mergeSort(arr,mid+1,end);
		merge(arr,start,mid,end);
	}
	public static void merge(int arr[],int start,int mid,int end){
		//take extra array to store elements
		int krr[]=new int[end-start+1];
		int i=start;
		int j=mid+1;
		int k=0;
		while(i<=mid && j<=end){
			if(arr[i]>arr[j]){
				krr[k++]=arr[j++];
			}
			else{
				krr[k++]=arr[i++];
			}
		}
		while(i<=mid){
			krr[k++]=arr[i++];
		}
		while(j<=end){
			krr[k++]=arr[j++];
		}
		for(k=0,i=start;k<krr.length;k++,i++){
			arr[i]=krr[k];
		}
		}
		//quick sort
	public static void quickSort(int arr[],int start,int end){
		//it is soo efficient algorithm 
		if(start>end){
			return;
		}
		int pvt=quick(arr,start,end);
		quickSort(arr,start,pvt-1);
		quickSort(arr,pvt+1,end);
		}
	public static int quick(int arr[],int start,int end){
		int pivot=arr[end];
		int i=start-1;
		int j=start;
		while(j<end){
			if(arr[j]<pivot){
				i++;
				int temp=arr[i];
				arr[i]=arr[j];
				arr[j]=temp;
			}
			j++;
		}

		i++;
		int temp=arr[i];
		arr[i]=pivot;
		pivot=arr[end];
		return i;
	}

	public static void main(String []args){
		int arr[]={-1,2,12,5,6,-24,23};
		//bubble sort->selection sort->insertion sort-> merge sort->quick sort
  //   bubbleSort(arr);
  //   selectionSort(arr);
  //   insertionSort(arr);
		// mergeSort(arr,0,arr.length-1);
    quickSort(arr,0,arr.length-1);
		printArr(arr);
	}
}

