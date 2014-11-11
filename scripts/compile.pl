use strict;
use warnings;

use Getopt::Long;
use YAML;
use JSON;

my $output_format = 'json';

my $fn_base_layout = '../layouts/og.en-UK.yml'; # get this from options

GetOptions (
	'format=s'=>\$output_format,
);

open my $fh_base_layout, '<', $fn_base_layout or die;

my $base_layout = Load (join '', <$fh_base_layout>);

my $compiled_layout = Load Dump $base_layout;

my $merge          = {}; 
my $initial        = {};
my $nglyphs        = {};
my $best_result    = {};
my $best_substring = {};

my @buttons = map {
		my $row = $_; 
		map { $row.$_ } qw(l c r) 
	} qw (t m b);

foreach my $i (@buttons) {
	foreach my $j (@buttons){
		my $letter = $base_layout->{$i}->{$j};
		next unless defined $letter;
		if ($letter =~ m/^[a-z]$/) {
			$merge->{$letter} = $j;
			$initial->{$letter} = $i.$j;
		}
	}
}

# die Dump [$merge, $initial];


sub get_merged {
	my @letters = split //, shift;
	my $first = shift @letters; 
	my $merged = $initial->{$first} . join '', map {$merge->{$_}} @letters;
	$merged =~ s/([tmb][lcr])\1/$1/g; # duplicates
	return $merged;
}

sub add_substring {
	my $substring = shift;
	my $freq = shift;
	my $len = length ($substring);
	$nglyphs->{$len}->{$substring} += $freq;
}

sub add_substrings {
	my $word      = shift;
	my $substring = $word;
	my $freq      = shift;
	while (length($substring) > 1) {
		# add_substring($substring, $freq);
		my $merged = get_merged $substring;
		if (exists $best_result->{$merged}) {
			# usually, do nothing, we're in descending freq order, so we already have the best result
			# but actually if we have a substring then we should use it, e.g. building > build but do build and people can then carry on to building
			if ($best_result->{$merged}->{word} =~ /^$word.+/) {
				$best_result->{$merged} = { word => $word , freq => $freq }; # maybe a cut-off so kin does not overwrite kind
			}
			# do we want another counter so that kindling contributes to kind and kingdom to king?
		}
		else {
			$best_result->{$merged} = { word => $word , freq => $freq };
		}
		$best_substring->{$merged}->{$substring} += $freq;
		chop $substring;
	};
}

die ('Pipe a frequency table into this script') unless -p STDIN;

while (<STDIN>) {
	my $line = $_;
	chomp $line;
	next unless $line =~ /^(\d+)\s([a-z]+)/; # keep it simple
	my ($freq, $word) = ($1, $2);
	next if $word =~ /^!/; # then it is a comment
	next unless $word =~ /^[a-z]+$/; # for the time being, we keep it simple
	add_substrings($word, $freq);
}

# now use best_substring and best_match to populate the new layout

sub descend_into {
	my ($layout, $merged) = @_;
	return $layout unless $merged;
	die $merged unless $merged =~ /^(?:[tmb][lcr])+$/;
	if ($merged =~ s/^(..)(.*)$/$2/) {
		my $step = $1;
		if (defined $layout->{$step} and !ref $layout->{$step}) {
			$layout->{$step} = {
				label  => $layout->{$step},
				action => $layout->{$step},
			};
		}
		else {
			$layout->{$step} //= {};
		}
		descend_into ($layout->{$step}, $merged);
	}
	else {
		die $merged;
	}
}

foreach my $merged (sort { length ($a) cmp length ($b) } keys %$best_substring) {
	my ($best) = sort { $best_substring->{$merged}->{$b} cmp $best_substring->{$merged}->{$a} } 
		keys %{ $best_substring->{$merged} }; # get the top freq substring
	my $location = descend_into ($compiled_layout, $merged);
	$location->{label} = chop $best; # this might be all wrong
}

foreach my $merged (sort { length ($a) cmp length ($b) } keys %$best_result) {
	my $final_key = substr ($merged, length($merged) -2);
	my $location = descend_into ($compiled_layout, $merged);
	my $refloc = \$location;
	while (defined $$refloc->{action}) {
		$$refloc->{$final_key} //= {};
		$refloc = \($$refloc->{$final_key});
	}
	$$refloc->{action} = $best_result->{$merged}->{word};
}

if ($output_format =~ /^yaml$/i) {
	print Dump $compiled_layout;
}
else {
	print to_json ($compiled_layout, {max_depth=>512});
}
