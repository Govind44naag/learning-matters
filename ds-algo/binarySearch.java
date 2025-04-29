import java.util.*;
public class binarySearch{
        public static int  binSearch(int arr[],int val){
                int i=0;
                int j=arr.length-1;
                while(i<=j){
                        int mid=i+(j-i)/2;
                        if(val==arr[mid]){
                                return mid;
                        }
                        else if(val>arr[mid]){
                                i=mid+1;
                        }
                        else{
                                j=mid-1;
                        }
                }

                return -1;
        }

        public static void main(String []args){
                Scanner sc=new Scanner(System.in);
                int arr[]={1,5,6,8,10,11,20};
                System.out.println("Enter value for which find in array");
                int value=sc.nextInt();
                int idx=binSearch(arr,value);
                System.out.println("index value is "+idx);
        }
}
