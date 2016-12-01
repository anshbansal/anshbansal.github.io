**Summary**

We are trying to create a visual that shows the demographics or passenger information between those passengers who survived and those who died during titanic disaster. Specifically a visual for the comparison of Survival by Gender and across economic classes.

**Initial Design**

While choosing the graph I thought that bars would be ideal for this as we need to compare. I thought some animation transitioning between male/female would like nice. That way people can feel the difference in survival across genders.

**First Iteration**
https://bl.ocks.org/anshbansal/dc216622d85b7b827271fe378f3a3001/e6b25a24d17efa00567b43a2b4541f9aa8076bf6

Feedback
- By looking at the graphs moving around what comes to my mind is that something is increasing or decreasing. Comparison does not come into my mind. For comparison both of these should be shown together. 
- I don’t know the significance of red and green. What is that for? I can see something written at the top “male”, “female” but not sure

**Retrospective for Design changes**

The idea for animation does not seem good now. It seems going simpler is the way to go.

**Second Iteration**
https://bl.ocks.org/anshbansal/dc216622d85b7b827271fe378f3a3001/070e6a7f8bbd6736662b4a4d7fb078707df44081

Feedback
- By looking at the 2 graphs we can compare but it is still not possible to understand what these 2 bars stand for. 
- It is not clear what red/green stand for

**Retrospective for Design changes**

- Need to make gender distinction clear. 
- The legend containing 0 and 1 is not clear at all

**Third Iteration**
https://bl.ocks.org/anshbansal/dc216622d85b7b827271fe378f3a3001/cee40e68cfce166001da891eed502c91f9107779

Feedback
- Looks much better. Now can understand that it is a comparison between male/female

**Retrospective for Design changes**

The tooltip/dropline and y axis are giving the same information. Should be dropped to make it simpler. Currently someone looking at it cannot find the exact percent without interacting with the graph. Also a few sentences containing some explanation would help a lot.

**Fourth Iteration**
https://bl.ocks.org/anshbansal/dc216622d85b7b827271fe378f3a3001/78492a40c6dff5d332b4490f810fbe2a105c0819

Feedback
- Easily understood

**Retrospecitve**

Simple enough and easily understood without any explanation

**Feedback from Udacity after 1st submission**

- The current version was indented to be most simple and clear as I can see from the progression in the README.md. But what you get instead is basically a fancy table with all the data presented by text and numbers and there are also bars. I'd suggest moving the exact numbers back in a tooltip, returning of the y-axis (so the approximate scale of value will be clear, as in current version there is no visual 100% level) and removing labels "male/female". Instead of such labels, I suggest using color coding for bars (bluish/pinkish for males/females for example) and adding the legend, explaining the colors.

**Retrospecitve**

- Reading about color I initially thought doesn't this go against maximizing data/ink ratio? But then I understood that I was mistaken in that minimizing colors would maximize data ink ratio. The green color has been used only to show survival but that is not actually conveying anything. So my current color usage is not helping. Similarly I am using text in multiple places to convey which bar is for male and which is for female. But that is exactly what color should be used for. So the feedback makes sense.
- Reading about showing y axis, droplines and tooltips I was skeptical at first. But then I thought having a sense of maximum can actually help here as it gives a sense of how many died. Hence, showing y axis makes sense. The droplines could help with a comparison across classes as the dropline would cross over the bars. Showing tooltips instead of showing numbers on top could help as that reduces the initial cognitive load and lets a person get a sense by looking at the lengths only. In case someone wants to look at the details then they should be able to.
 
**Fifth Iteration**
https://bl.ocks.org/anshbansal/dc216622d85b7b827271fe378f3a3001/40f4633b4720983a019650794e4c37e165bf6c64
 
**References/Credits**
- https://discussions.udacity.com/t/p6-titanic-how-should-we-show-gender/199071/5
- http://stackoverflow.com/questions/11529273/python-condense-if-else-to-one-line
- http://stackoverflow.com/questions/18942506/add-new-column-in-pandas-dataframe-python
- http://stackoverflow.com/questions/12555323/adding-new-column-to-existing-dataframe-in-python-pandas
- https://github.com/PMSI-AlignAlytics/dimple/wiki/dimple.aggregateMethod#count
- http://dimplejs.org/examples_viewer.html?id=bars_horizontal_stacked_100pct
- https://github.com/PMSI-AlignAlytics/dimple/blob/master/data/example_data.tsv
- My friends whom I am bugged to get feedback for the visualization
