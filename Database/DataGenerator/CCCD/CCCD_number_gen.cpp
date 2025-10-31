#include <bits/stdc++.h>
#include <stdio.h>
#include <stdlib.h>
#include <time.h>
#include <windows.h>
using namespace std;
int randomNum(int a)
{
    int number = rand() % a;
    return number;
}
int randomNumInRange(int a, int b)
{
    int number = rand() % (b - a + 1) + a;
    return number;
}
int maVung[63] = {1, 2, 4, 6, 8, 10, 11, 12, 14, 15, 17, 19, 20, 22, 23, 25, 26, 27, 30, 31, 33, 34, 35, 36, 37, 38, 40, 42, 44, 45, 46, 48, 49, 51, 52, 54, 56, 58, 60, 62, 64, 66, 67, 68, 70, 72, 74, 75, 77, 79, 80, 82, 83, 84, 86, 87, 89, 91, 92, 93, 94, 95, 96};
int main()
{
    srand(time(NULL));
    FILE *f;
    f = fopen("./CCCD/cccd.txt", "w");
    for (int nums = 0; nums < 50; nums++)
    {

        fprintf(f, "%03d", maVung[randomNum(63)]);
        int k = randomNum(4);
        switch (k)
        {
        case 0:
        case 1:
            fprintf(f, "%d%02d", k, randomNumInRange(70, 99));
            break;
        case 2:
        case 3:
            fprintf(f, "%d%02d", k, randomNumInRange(0, 25));
            break;
        }
        fprintf(f, "%06d", randomNum(999999));
        Sleep(100);
        if (nums != 49)
            fprintf(f, "\n");
        Sleep(randomNum(500));
    }
    fclose(f);
    return 0;
}
