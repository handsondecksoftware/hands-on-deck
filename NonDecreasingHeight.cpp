//https://leetcode.com/problems/height-checker/
// O(n) time and space complexity

int heightChecker(vector<int>& heights) {
    int count = 0;
    vector<int> h = heights;
    sort(heights.begin(), heights.end());
    for(int i = 0; i < heights.size(); i++)
        count += heights[i] != h[i];
    return count;
}