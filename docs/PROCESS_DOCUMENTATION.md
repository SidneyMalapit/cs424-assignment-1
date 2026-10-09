# process and documentation

## T1: Observing my daily commute to class

### Four inital questions
- How might trends manifest in the data I collect about my
  transit to/from campus?
- How might external factors affect my transit?
- Will the data reveal something about my commute habits? Or
  possibly some external factors that impact my ride?
- How much time will I usually spend on campus?

I plan to collect data about my commute to and from campus

- **Over how many locations, times, or days will you collect
  it?**
    - probably not over too many locations, but over many days
      and times
- **How will you decide what to observe?**
    - whatever comes to mind/is an easy or obvious attribute to
      record
- **What might your collection process fail to capture?**
    - specific events that impact the duration of my commute
- **How might your collection process introduce bias?**
    - might forget to record some times and thus introduce a
      temporal offset in the data

Since I have Google Sheets installed on my phone, I'll be using
that to easily record data items from my commute.

[**Data collection spreadsheet**](https://docs.google.com/spreadsheets/d/1-2Z2D2LUQVXEo4_aCibJcYbf_6ATQ67Pk72uiq38kME/edit?usp=sharing)

### Attributes to collect

**Commute timestamps**
|attribute|type|description|example|
|---|---|---|---|
|day|temporal|Date of collection|2026-09-14|
|leave\_home|temporal|Time of departure from house|08:13 AM|
|arrive\_school|temporal|Time of departure from last public transportation vehicle (bus, train) to campus<br><br>(ex. if I were to take the Blue Line to campus, I mark the time I take the first step onto the UIC-Halsted Blue Line platform)|9:23 AM|
|leave\_school|temporal|Time of arrival at station for first form of public transportation to get home<br><br>(ex. if I were to take the Blue Line home, I mark the time I first get to the UIC-Halsted Blue Line platform)|04:10 PM|
|arrive\_home|temporal|Time of arrival at house|05:33 PM|
|notes|n/a|What happened that day that may have affected my usual schedule (for my own journal purposes; not included in csv)|went out for sushi; train delayed multiple times|

## T2: Pilot collection

Here are my findings after doing some observations:

- **Were the attributes clear and easy to record?**
    - i only had to record timestamps so that wasn't too hard,
      but sometimes i would be tired after classes and forget to
      record the exact time when i get home, so i would estimate
    - figured out i could have my phone automatically record when
      i arrive at certain locations, so it helps if i sometimes
      forget to record the exact time, but has an offset of ~1-2
      minutes
- **Did the pilot change the kinds of questions you thought you
  could answer?**
    - i definitely felt like i wasn't getting enough data points,
      or at least not enough to generate sufficient questions
      using the data

After considering the above, I decided to collect data about the
vehicles I take. Attributes listed below:

**Public transport vehicle observations** 
|attribute|type|description|example|
|---|---|---|---|
|day|temporal|Date of collection|2026-09-14|
|order|quanitative|`N`th vehicle taken when commuting to/from campus|3|
|name|categorical|Name of the vehicle line taken|Blue Line|
|returning|categorical (boolean)|Whether this vehicle was taken to get home|False|
|destination|categorical|Name of the last stop the vehicle serves before going out of service or assuming a different route|Jefferson Park|
|model\_number|categorical|Model number of the vehicle taken|5233|
|route\_modifier|categorical|Label that marks an alternate route/destination that deviates from the vehicle's usual trip|5000 Express|

I originally wanted to collect the line authority (CTA, PACE) of
the vehicles I take, as well as whether they were a bus or train,
but I realized I could just make a lookup table for the table
above, which looks like this:

**Vehicle line information**
|attribute|type|description|example|
|---|---|---|---|
|name|categorical|Name of the line|290|
|authority|categorical|Transit authority that governs this line|PACE|
|vehicle\_type|categorical|Kind of vehicle|bus|

which can be joined on the public transport vehicle table.

One thing I also remembered I wanted to do was to compare the
schedule my commute data makes with my class schedule for this
semester.

**Course schedule**
|attribute|type|description|example|
|---|---|---|---|
|course|categorical|Name of the course|CS 480|
|day|ordinal|Day of the week for the class|Wednesday|
|start|temporal|Time of class start|11:00|
|end|temporal|Time of class end|12:15|

## T3: Description and domain questions

At first, I collected timestamps every day I went to campus to
illustrate my commute through data, but that wasn't meaningful
enough for me. I then decided to collect specific information
about the vehicles I rode for my commute in a different table,
the specific attributes of that table listed in T2. Regarding the
first table, since rows can only be collected after days where I
commute to and from campus, the table (as of now) contains 14
rows, with each row holding four timestamps. I've only collected
temporal and categorical data; the temporal data mostly within my
first table, and categorical data within the second. I've
structured them both to use the date as an index, to allow for
aggregation or joining of the tables upon date. With regards to
spatial variation, there isn't much since I only really collect
temporal data from my house and from the Blue Line, nowhere else.
Spatial data was not collected for the data on specific vehicle
information. However, if I were to map the destinations of
vehicles to locations, spatial information can be manifested in
that way (which I don't plan on doing, but who knows).

### Four domain questions

I felt like the original questions I came up with were a little
too vague. Since there's new data I hadn't considered before, I
can also consider that while ideating these domain questions.

- Q1: How long am I away from home on days I commute to campus?
Changed from "How much time will I usually spend on campus?"
since timestamps from one guaranteed location (my house) seems
more sensible to consider, even though I've only ever taken the
Blue Line to/from campus so far this semester. This could,
however, change if I decide to take the Metra.
- Q2: Which routes end up taking the longest?
A rather easy question to ask, but will require some narrowing
down and specifics when actually attempting to answer. I ought to
try and avoid having to go these routes when possible.
- Q3: Are certain days more prone to variation in my commute?
I think this is a good question. I have some preconceptions
regarding this considering the shenanigans I do with friends
after class. This question also branches off "How might external
factors affect my transit?"
- Q4: How much downtime do I usually have before my first class
  of the day?
Usually, I spend this time doing homework I hadn't completed the
night before. I'd want to know about this in order to increase it
if possible.

## T4: Domain questions -> Abstract tasks

- AT1: Find the average (mean) of the difference in values over
  multiple days of collection.
- AT2: Find the difference in value between a pair of data points
  collected in the same day. Repeat this for all pairs collected
  over multiple days, and sort the differences of these pairs in
  descending order.
- AT3: Find the difference in value between a pair of data points
  collected in the same day. Repeat this for all pairs collected
  over multiple days. Aggregate these differences by averaging
  them over its correspondent weekday category, and sort them in
  descending order by the average.
- AT4: Find the average of the difference between two timestamps
  over multiple days of collection.

In order to translate the domain-specific questions into abstract
tasks, I thought back to how I approach solving problems in SQL.
I broke down each problem into a set of tasks that can be
completed with different clauses in a query. I also generalized
the data by avoiding referring to them as they're named in the
data tables.
