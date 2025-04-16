public class sorting{
	public static void bubbleSort(int arr[]){
		for(int i=0;i<arr.length;i++){
			boolean flag=false;
			for(int j=0;j<arr.length-1-i;j++){
				if(arr[j]>arr[j+1]){
					int temp=arr[j];
					arr[j]=arr[j+1];
					arr[j+1]=temp;
					
				}
				flag=true;
			}
			if(flag==false){
				return;
		}
	}
	 

	}
	public static void main(String []args){
		int arr[]={4,5,2,5,7};
		bubbleSort(arr);
		for(int i=0;i<arr.length;i++){
			System.out.print(arr[i]+",");
		}
	}
}