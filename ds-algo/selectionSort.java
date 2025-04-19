public class selectionSort{
    //selection sort
    public static void selSort(int arr[]){
        for(int i=0;i<arr.length;i++){
            for(int j=i+1;j<arr.length;j++){
                if(arr[i]>arr[j]){
                    int temp =arr[j];
                    arr[j]=arr[i];
                    arr[i]=temp;
                }
            }
        }
    }
 
    public static void printArr(int arr[]){
        for(int i=0;i<arr.length;i++){
            System.out.print(arr[i]+",");
        }
        System.out.println();
    }
    public static void main(String[ ] args){
        int arr[]={1,6,4,0,2,-1,54};
        //selection sort
        selSort(arr);
        printArr(arr);
       

    }
}
